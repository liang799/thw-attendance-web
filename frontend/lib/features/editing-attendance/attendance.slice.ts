import { Attendance } from '@/utils/types/AttendanceData';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type NonEmptyAttendanceSelection = readonly [Attendance, ...Attendance[]];

export type AttendanceEditorState =
  | { status: 'idle' }
  | { status: 'selecting'; selected: Attendance[] }
  | { status: 'editing'; attendance: Attendance }
  | { status: 'bulkEditing'; selected: NonEmptyAttendanceSelection }
  | { status: 'creating' };

export type AttendanceState = {
  editor: AttendanceEditorState;
  tabIndex: number;
};

const initialState: AttendanceState = {
  editor: { status: 'idle' },
  tabIndex: 0,
};

/* Redux Toolkit uses Immer under the hood. As such, it is safe to write in this manner */
// Only idle opens a workflow; selection opens bulk editing. Each close action
// applies only to its own mode, so unrelated events leave the editor unchanged.
export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<Attendance[]>) => {
      if (state.editor.status !== 'selecting') return;
      for (const attendance of action.payload) {
        if (!state.editor.selected.some(selected => selected.id === attendance.id)) {
          state.editor.selected.push(attendance);
        }
      }
    },
    deselect: (state, action: PayloadAction<Attendance[]>) => {
      if (state.editor.status !== 'selecting') return;
      state.editor.selected = state.editor.selected.filter(
        (selectedEntry) => !action.payload.some((deselectedEntry) => deselectedEntry.id === selectedEntry.id)
      );
    },
    deselectAll: (state) => {
      if (state.editor.status !== 'selecting') return;
      state.editor.selected = [];
    },
    enterSingleEdit: (state, action: PayloadAction<Attendance>) => {
      if (state.editor.status !== 'idle') return;
      state.editor = { status: 'editing', attendance: action.payload };
    },
    exitSingleEdit: (state) => {
      if (state.editor.status !== 'editing') return;
      state.editor = { status: 'idle' };
    },
    enableSelection: (state) => {
      if (state.editor.status !== 'idle') return;
      state.editor = { status: 'selecting', selected: [] };
    },
    disableSelection: (state) => {
      if (state.editor.status !== 'selecting') return;
      state.editor = { status: 'idle' };
    },
    enterAttendanceCreation: (state) => {
      if (state.editor.status !== 'idle') return;
      state.editor = { status: 'creating' };
    },
    exitAttendanceCreation: (state) => {
      if (state.editor.status !== 'creating') return;
      state.editor = { status: 'idle' };
    },
    enterBulkEditing: (state) => {
      if (state.editor.status !== 'selecting') return;
      const [first, ...rest] = state.editor.selected;
      if (!first) return;
      state.editor = { status: 'bulkEditing', selected: [first, ...rest] };
    },
    exitBulkEditing: (state) => {
      if (state.editor.status !== 'bulkEditing') return;
      state.editor = { status: 'selecting', selected: [] };
    },
    setTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload;
    },
  },
});

export const {
  select,
  deselect,
  deselectAll,
  enterSingleEdit,
  exitSingleEdit,
  enableSelection,
  disableSelection,
  enterAttendanceCreation,
  exitAttendanceCreation,
  enterBulkEditing,
  exitBulkEditing,
  setTabIndex,
} = attendanceSlice.actions;


export default attendanceSlice.reducer;
