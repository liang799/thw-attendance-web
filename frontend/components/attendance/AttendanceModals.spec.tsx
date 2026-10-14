/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { useState } from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { ApiClient } from '@/utils/axios';
import { Attendance, UpdateAttendanceData } from '@/utils/types/AttendanceData';
import { NonEmptyAttendanceSelection } from '@/lib/features/editing-attendance/attendance.slice';
import AttendanceModal from './AttendanceModal';
import BulkEditingModal from './BulkEditingModal';

jest.mock('@/utils/axios', () => ({ ApiClient: { put: jest.fn() } }));

const put = jest.mocked(ApiClient.put);
const first: Attendance = {
  id: 1,
  user: { id: 10, name: 'First', rank: '', type: 'S1 Branch', hasLeftNode: false },
  availability: { type: 'Expect Arrival', status: 'Present', user: 10 },
  parade: 1,
  submittedAt: new Date('2024-01-01T00:00:00Z'),
};
const selected: NonEmptyAttendanceSelection = [
  first,
  { ...first, id: 2, user: { ...first.user, id: 20, name: 'Second' } },
];

function deferred() {
  let resolve!: (value: unknown) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

beforeAll(() => {
  // Rejected saves are intentional in these tests; keep other console errors visible.
  setLogger({ log: console.log, warn: console.warn, error: () => {} });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => { put.mockReset(); });
afterEach(cleanup);
afterAll(() => setLogger(console));

describe.each(['single', 'bulk'] as const)('%s attendance editing', mode => {
  const endpoint = mode === 'single' ? '/attendances/1' : '/attendances';
  const payloadFor = (data: UpdateAttendanceData) => mode === 'single'
    ? data
    : selected.map(attendance => ({ ...data, id: attendance.id, user: attendance.user.id }));

  function renderEditor() {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidate = jest.spyOn(client, 'invalidateQueries');
    const closed = jest.fn();

    function Editor() {
      const [open, setOpen] = useState(true);
      const handleClose = () => {
        closed();
        setOpen(false);
      };
      if (!open) return null;
      return mode === 'single'
        ? <AttendanceModal attendance={first} handleClose={handleClose} />
        : <BulkEditingModal selected={selected} handleClose={handleClose} />;
    }

    render(
      <ChakraProvider>
        <QueryClientProvider client={client}><Editor /></QueryClientProvider>
      </ChakraProvider>,
    );
    return { user: userEvent.setup(), closed, invalidate };
  }

  it('keeps dispatch details visible during a save and retries them after failure', async () => {
    const request = deferred();
    put.mockReturnValueOnce(request.promise).mockResolvedValueOnce({});
    const { user, closed, invalidate } = renderEditor();
    const status = screen.getByRole('combobox', { name: 'Status' });
    await user.selectOptions(status, screen.getByRole('option', { name: 'Dispatch' }));
    const location = screen.getByRole('textbox', { name: 'Dispatch location' });
    await user.type(location, 'HQ reception');

    const submit = screen.getByRole('button', { name: 'Submit' });
    await user.dblClick(submit);

    expect(put).toHaveBeenCalledTimes(1);
    expect(put).toHaveBeenLastCalledWith(endpoint, payloadFor({
      availability: 'Dispatch', status: 'Dispatch', location: 'HQ reception',
    }));
    expect(location).toBeVisible();
    expect(location).toHaveValue('HQ reception');
    expect(location).toBeDisabled();
    expect(status).toBeDisabled();
    expect(submit).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
    await user.keyboard('{Escape}');
    expect(closed).not.toHaveBeenCalled();

    await act(async () => request.reject(new Error(`${mode} save failed`)));
    await waitFor(() => expect(submit).toBeEnabled());

    expect(await screen.findByText(`${mode} save failed`)).toBeVisible();
    expect(closed).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Dispatch location' })).toBe(location);
    expect(location).toHaveValue('HQ reception');
    expect(location).toBeEnabled();
    expect(status).toHaveDisplayValue('Dispatch');

    await user.click(submit);
    await waitFor(() => expect(closed).toHaveBeenCalledTimes(1));
    expect(put).toHaveBeenCalledTimes(2);
    expect(put.mock.calls[1]).toEqual(put.mock.calls[0]);
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('preserves a chosen date range after a failed save', async () => {
    const request = deferred();
    put.mockReturnValueOnce(request.promise).mockResolvedValueOnce({});
    const { user, closed } = renderEditor();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Status' }),
      screen.getByRole('option', { name: 'MC' }));
    const dates = screen.getByRole<HTMLInputElement>('textbox', { name: 'MC Dates' });
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 3);
    const end = new Date(now.getFullYear(), now.getMonth(), 7);
    await user.click(dates);
    await user.click(screen.getByLabelText(start.toDateString(), { selector: 'button' }));
    await user.click(screen.getByLabelText(end.toDateString(), { selector: 'button' }));
    const chosenRange = dates.value;
    const submit = screen.getByRole('button', { name: 'Submit' });
    await user.click(submit);

    expect(dates).toBeVisible();
    expect(dates).toBeDisabled();
    expect(put).toHaveBeenLastCalledWith(endpoint, payloadFor({
      availability: 'Absent', status: 'MC', absentStartDate: start, absentEndDate: end,
    }));

    await act(async () => request.reject(new Error('Connection lost')));
    await waitFor(() => expect(submit).toBeEnabled());
    expect(closed).not.toHaveBeenCalled();
    expect(screen.getByRole('textbox', { name: 'MC Dates' })).toBe(dates);
    expect(dates).toHaveValue(chosenRange);
    expect(dates).toBeEnabled();
    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveDisplayValue('MC');

    await user.click(submit);
    await waitFor(() => expect(closed).toHaveBeenCalledTimes(1));
    expect(put.mock.calls[1]).toEqual(put.mock.calls[0]);
  }, 15000);

  it('allows changing the draft after failure without sending hidden fields', async () => {
    put.mockRejectedValueOnce(new Error('Connection lost')).mockResolvedValueOnce({});
    const { user, closed } = renderEditor();
    const status = screen.getByRole('combobox', { name: 'Status' });
    await user.selectOptions(status, screen.getByRole('option', { name: 'Dispatch' }));
    await user.type(screen.getByRole('textbox', { name: 'Dispatch location' }), 'HQ');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(status).toBeEnabled());
    expect(closed).not.toHaveBeenCalled();

    await user.selectOptions(status, screen.getByRole('option', { name: 'Present' }));
    await user.selectOptions(status, screen.getByRole('option', { name: 'Dispatch' }));
    expect(screen.getByRole('textbox', { name: 'Dispatch location' })).toHaveValue('HQ');
    await user.selectOptions(status, screen.getByRole('option', { name: 'Present' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(closed).toHaveBeenCalledTimes(1));
    expect(put).toHaveBeenLastCalledWith(endpoint, payloadFor({
      availability: 'Expect Arrival', status: 'Present',
    }));
  });
});
