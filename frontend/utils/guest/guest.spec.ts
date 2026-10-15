/** @jest-environment jsdom */
import { ApiClient } from '@/utils/axios';
import { getUserId } from '@/utils/auth';
import { endGuestSession, GUEST_USER_ID, isGuestMode, readGuestData, startGuestSession } from './session';
import type { ParadeData } from '@/utils/types/ParadeData';

jest.mock('react-secure-storage', () => ({
  __esModule: true,
  default: { getItem: jest.fn(() => null), setItem: jest.fn(), clear: jest.fn() },
}));

const network = jest.fn();
const originalAdapter = ApiClient.defaults.adapter;

beforeEach(() => {
  sessionStorage.clear();
  network.mockReset();
  ApiClient.defaults.adapter = network;
  startGuestSession();
});

afterEach(() => {
  expect(network).not.toHaveBeenCalled();
  ApiClient.defaults.adapter = originalAdapter;
});

async function ongoing(): Promise<ParadeData> {
  return (await ApiClient.get('/ongoing-parade')).data;
}

it('uses fictional identity and returns all six branches, current attendance, and history without a backend', async () => {
  expect(getUserId()).toBe(GUEST_USER_ID);
  const parade = await ongoing();
  expect(parade.strength).toHaveLength(6);
  expect(parade.attendances).toHaveLength(11);
  expect((await ApiClient.get('/parades')).data).toHaveLength(3);
  expect((await ApiClient.get('/users/1')).data.name).toBe('Alex Tan');
  expect((await ApiClient.get('/ongoing-parade/users/1/attendance')).data.availability.status).toBe('Present');
});

it('persists submitted attendance and recomputes summaries and strength without duplicate records', async () => {
  await ApiClient.post('/attendances', {
    user: GUEST_USER_ID, availability: 'Absent', status: 'MC',
    absentStartDate: '2026-10-15', absentEndDate: '2026-10-16',
  });
  const parade = await ongoing();
  expect(parade.attendances).toHaveLength(11);
  expect(parade.summary.find(item => item.status === 'MC')?.count).toBe(2);
  expect(parade.strength.find(item => item.type === 'Commander')?.present).toBe(1);
  expect(readGuestData().attendances.find(item => item.parade === parade.id && item.user.id === GUEST_USER_ID)?.availability.absentEndDate).toBe('2026-10-16T00:00:00.000Z');
});

it('supports bulk updates, deletion, and adding a missing person', async () => {
  const parade = await ongoing();
  const selected = parade.attendances.slice(0, 2);
  await ApiClient.put('/attendances', selected.map(item => ({ id: item.id, user: item.user.id, availability: 'Dispatch', status: 'Dispatch', location: 'Demo HQ' })));
  expect((await ongoing()).attendances.slice(0, 2).every(item => item.availability.dispatchLocation === 'Demo HQ')).toBe(true);
  await ApiClient.delete(`/attendances/${selected[0].id}`);
  await ApiClient.post('/attendances', { user: 12, availability: 'Expect Arrival', status: 'Present' });
  expect((await ongoing()).attendances.map(item => item.user.id)).toContain(12);
  expect((await ongoing()).attendances.map(item => item.user.id)).not.toContain(selected[0].user.id);
});

it('leaves saved data unchanged when one bulk update is invalid', async () => {
  const parade = await ongoing();
  await expect(ApiClient.put('/attendances', [
    { id: parade.attendances[0].id, availability: 'Expect Arrival', status: 'Late' },
    { id: 99999, availability: 'Expect Arrival', status: 'Late' },
  ])).rejects.toMatchObject({ response: { status: 404 } });
  expect((await ongoing()).attendances[0].availability.status).toBe('Present');
});

it('stops a parade and creates a fresh one while preserving history and unexpired absence', async () => {
  const parade = await ongoing();
  await ApiClient.post('/attendances', { user: 1, availability: 'Absent', status: 'MC', absentStartDate: '2099-01-01', absentEndDate: '2099-01-03' });
  await expect(ApiClient.post('/parades', { startDate: '2099-01-01' })).rejects.toMatchObject({ response: { status: 409 } });
  await ApiClient.patch(`/parades/${parade.id}`, { endDate: new Date() });
  expect(await ongoing()).toBeNull();
  await expect(ApiClient.post('/attendances', { user: 1, availability: 'Expect Arrival', status: 'Present' })).rejects.toMatchObject({ response: { status: 409 } });
  await ApiClient.post('/parades', { startDate: '2099-01-02' });
  expect((await ongoing()).attendances).toHaveLength(12);
  expect((await ongoing()).attendances.find(item => item.user.id === 1)?.availability.status).toBe('MC');
  expect((await ApiClient.get('/parades')).data).toHaveLength(4);
  expect((await ApiClient.get(`/parades/${parade.id}`)).data.endDate).toBeTruthy();
});

it('creates and edits demo people and carries their changes into attendance', async () => {
  const created = (await ApiClient.post('/users', { type: 'S1 Branch', name: 'Demo Person', rank: 'CPL' })).data;
  await ApiClient.patch(`/users/${created.id}`, { type: 'S3 Branch', name: 'Updated Person', rank: 'LCP', hasLeftNode: false });
  expect((await ongoing()).attendances.find(item => item.user.id === created.id)?.user.name).toBe('Updated Person');
});

it('blocks authentication and unknown or absolute routes locally and removes authorization headers', async () => {
  for (const url of ['/auth/login', '/auth/changePassword', '/unsupported', 'https://example.com/users']) {
    await expect(ApiClient.post(url, {})).rejects.toMatchObject({ response: { status: 403 } });
  }
  const response = await ApiClient.get('/users', { headers: { Authorization: 'Bearer real-token' } });
  expect(response.config.headers.Authorization).toBeUndefined();
});

it('recovers corrupt or missing data locally, and reset and exit remove demo changes', async () => {
  sessionStorage.setItem('thw-guest-data-v1', '{broken');
  expect((await ongoing()).attendances).toHaveLength(11);
  sessionStorage.removeItem('thw-guest-data-v1');
  expect((await ongoing()).attendances).toHaveLength(11);
  await ApiClient.post('/users', { type: 'S1 Branch', name: 'Temporary Person', rank: 'CPL' });
  startGuestSession();
  expect((await ApiClient.get('/users')).data).toHaveLength(12);
  endGuestSession();
  expect(isGuestMode()).toBe(false);
  expect(sessionStorage.getItem('thw-guest-data-v1')).toBeNull();
  expect(getUserId()).toBeNull();
});

it('uses the configured API transport again after exiting the demo', async () => {
  endGuestSession();
  const normalTransport = jest.fn(async config => ({ data: { access_token: 'test' }, status: 200, statusText: 'OK', headers: {}, config }));
  ApiClient.defaults.adapter = normalTransport;
  await ApiClient.post('/auth/login', { userName: 'test', password: 'test' });
  expect(normalTransport).toHaveBeenCalledTimes(1);
});
