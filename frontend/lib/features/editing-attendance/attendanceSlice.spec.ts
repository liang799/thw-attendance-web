import { Attendance } from '@/utils/types/AttendanceData';
import attendanceReducer, {
  AttendanceEditorState,
  AttendanceState,
  deselect,
  deselectAll,
  disableSelection,
  enableSelection,
  enterAttendanceCreation,
  enterBulkEditing,
  enterSingleEdit,
  exitAttendanceCreation,
  exitBulkEditing,
  exitSingleEdit,
  select,
  setTabIndex,
} from './attendance.slice';

const first: Attendance = {
  id: 1,
  user: { id: 1, type: 'S1 Branch', rank: '', name: 'First', hasLeftNode: false },
  availability: { type: 'Expect Arrival', status: 'Present', user: 1 },
  parade: 1,
  submittedAt: new Date('2024-01-01T00:00:00Z'),
};
const second: Attendance = {
  ...first,
  id: 2,
  user: { ...first.user, id: 2, name: 'Second' },
  availability: { ...first.availability, user: 2 },
};

function stateWith(editor: AttendanceEditorState): AttendanceState {
  return { editor, tabIndex: 2 };
}

describe('attendance editor reducer', () => {
  it('starts idle without a selection or editing target', () => {
    expect(attendanceReducer(undefined, { type: 'unknown' })).toEqual({
      editor: { status: 'idle' },
      tabIndex: 0,
    });
  });

  it('opens and closes single editing with a required target', () => {
    const idle = stateWith({ status: 'idle' });
    const editing = attendanceReducer(idle, enterSingleEdit(first));

    expect(editing).toEqual(stateWith({ status: 'editing', attendance: first }));
    expect(attendanceReducer(editing, exitSingleEdit())).toEqual(idle);
  });

  it('opens and closes attendance creation', () => {
    const idle = stateWith({ status: 'idle' });
    const creating = attendanceReducer(idle, enterAttendanceCreation());

    expect(creating).toEqual(stateWith({ status: 'creating' }));
    expect(attendanceReducer(creating, exitAttendanceCreation())).toEqual(idle);
  });

  it('starts selection empty and removes its data when disabled', () => {
    const idle = stateWith({ status: 'idle' });
    const selecting = attendanceReducer(idle, enableSelection());
    const selected = attendanceReducer(selecting, select([first, second]));

    expect(selecting).toEqual(stateWith({ status: 'selecting', selected: [] }));
    expect(selected).toEqual(stateWith({ status: 'selecting', selected: [first, second] }));
    expect(attendanceReducer(selected, disableSelection())).toEqual(idle);
  });

  it('keeps selection unique by attendance ID across repeated events', () => {
    const selecting = stateWith({ status: 'selecting', selected: [first] });
    const selected = attendanceReducer(selecting, select([{ ...first }, second, second]));

    expect(selected).toEqual(stateWith({ status: 'selecting', selected: [first, second] }));
  });

  it('deselects by ID rather than object identity and stays in selection mode', () => {
    const selecting = stateWith({ status: 'selecting', selected: [first, second] });
    const remaining = attendanceReducer(selecting, deselect([{ ...first }]));

    expect(remaining).toEqual(stateWith({ status: 'selecting', selected: [second] }));
    expect(attendanceReducer(remaining, deselect([second]))).toEqual(
      stateWith({ status: 'selecting', selected: [] }),
    );
  });

  it('clears all selections without leaving selection mode', () => {
    const selecting = stateWith({ status: 'selecting', selected: [first, second] });

    expect(attendanceReducer(selecting, deselectAll())).toEqual(
      stateWith({ status: 'selecting', selected: [] }),
    );
  });

  it('does not change the selection for empty selection events', () => {
    const selecting = stateWith({ status: 'selecting', selected: [first] });

    expect(attendanceReducer(selecting, select([]))).toEqual(selecting);
    expect(attendanceReducer(selecting, deselect([]))).toEqual(selecting);
  });

  it('refuses to open bulk editing with an empty selection', () => {
    const selecting = stateWith({ status: 'selecting', selected: [] });

    expect(attendanceReducer(selecting, enterBulkEditing())).toBe(selecting);
  });

  it('preserves the targets in bulk editing and clears them on close', () => {
    const selecting = stateWith({ status: 'selecting', selected: [first, second] });
    const bulkEditing = attendanceReducer(selecting, enterBulkEditing());

    expect(bulkEditing).toEqual(stateWith({ status: 'bulkEditing', selected: [first, second] }));
    expect(attendanceReducer(bulkEditing, exitBulkEditing())).toEqual(
      stateWith({ status: 'selecting', selected: [] }),
    );
  });

  it('cannot reopen bulk editing after closing it until targets are selected again', () => {
    let state = stateWith({ status: 'idle' });
    state = attendanceReducer(state, enableSelection());
    state = attendanceReducer(state, select([first]));
    state = attendanceReducer(state, enterBulkEditing());
    state = attendanceReducer(state, exitBulkEditing());

    expect(attendanceReducer(state, enterBulkEditing())).toBe(state);

    state = attendanceReducer(state, disableSelection());
    state = attendanceReducer(state, enterSingleEdit(second));
    expect(state).toEqual(stateWith({ status: 'editing', attendance: second }));
  });

  it.each([
    {
      state: stateWith({ status: 'idle' }),
      actions: [select([first]), deselect([first]), deselectAll(), disableSelection(),
        enterBulkEditing(), exitBulkEditing(), exitSingleEdit(), exitAttendanceCreation()],
    },
    {
      state: stateWith({ status: 'selecting', selected: [first] }),
      actions: [enableSelection(), enterSingleEdit(second), enterAttendanceCreation(),
        exitBulkEditing(), exitSingleEdit(), exitAttendanceCreation()],
    },
    {
      state: stateWith({ status: 'editing', attendance: first }),
      actions: [select([second]), deselect([first]), deselectAll(), enableSelection(),
        disableSelection(), enterSingleEdit(second), enterAttendanceCreation(),
        enterBulkEditing(), exitBulkEditing(), exitAttendanceCreation()],
    },
    {
      state: stateWith({ status: 'bulkEditing', selected: [first] }),
      actions: [select([second]), deselect([first]), deselectAll(), enableSelection(),
        disableSelection(), enterSingleEdit(second), enterAttendanceCreation(),
        enterBulkEditing(), exitSingleEdit(), exitAttendanceCreation()],
    },
    {
      state: stateWith({ status: 'creating' }),
      actions: [select([first]), deselect([first]), deselectAll(), enableSelection(),
        disableSelection(), enterSingleEdit(first), enterAttendanceCreation(),
        enterBulkEditing(), exitBulkEditing(), exitSingleEdit()],
    },
  ])('ignores unrelated events while $state.editor.status', ({ state, actions }) => {
    for (const action of actions) {
      expect(attendanceReducer(state, action)).toBe(state);
    }
  });

  it.each([
    stateWith({ status: 'idle' }),
    stateWith({ status: 'selecting', selected: [first] }),
    stateWith({ status: 'editing', attendance: first }),
    stateWith({ status: 'bulkEditing', selected: [first] }),
    stateWith({ status: 'creating' }),
  ])('changes tabs independently of the $editor.status workflow', (state) => {
    expect(attendanceReducer(state, setTabIndex(4))).toEqual({ ...state, tabIndex: 4 });
  });
});
