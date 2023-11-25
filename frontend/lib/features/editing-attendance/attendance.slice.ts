import { Attendance } from '@/utils/types/AttendanceData';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type initialStateType = {
  selected: Attendance[],
  currentlyEditing: Attendance | null,
  status: 'idle' | 'selecting' | 'editing' | string,
};

const initialState: initialStateType = {
  selected: [],
  currentlyEditing: null,
  status: 'idle',
};

/* Redux Toolkit uses Immer under the hood. As such, it is safe to write in this manner */
export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<Attendance[]>) => {
      state.selected = state.selected.concat(action.payload);
      state.status = 'selecting';
    },
    deselect: (state, action: PayloadAction<Attendance[]>) => {
      // Filter out the deselected attendance entries
      state.selected = state.selected.filter(
        (selectedEntry) => !action.payload.some((deselectedEntry) => deselectedEntry.id === selectedEntry.id)
      );
      state.status = 'selecting';
    },
    enterSingleEdit: (state, action: PayloadAction<Attendance>) => {
      state.currentlyEditing = action.payload;
      state.status = 'editing';
    },
    exitSingleEdit: (state) => {
      state.currentlyEditing = null;
      state.status = 'idle';
    },
    enableSelection: (state) => {
      state.status = "selecting";
    },
    disableSelection: (state) => {
      state.selected = [];
      state.currentlyEditing = null;
      state.status = 'idle';
    },
    enterAttendanceCreation: (state) => {
      state.status = 'creating';
    },
    exitAttendanceCreation: (state) => {
      state.status = 'idle';
    }
  },
});

export const { select, deselect, enterSingleEdit, exitSingleEdit, enableSelection, disableSelection, enterAttendanceCreation, exitAttendanceCreation } = attendanceSlice.actions;


export default attendanceSlice.reducer;
