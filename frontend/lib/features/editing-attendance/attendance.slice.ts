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

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<Attendance[]>) => {
      return {
        ...state,
        selected: [...state.selected, ...action.payload],
        status: 'selecting',
      };
    },
    deselect: (state, action: PayloadAction<Attendance[]>) => {
      // Filter out the deselected attendance entries
      state.selected = state.selected.filter(
        (selectedEntry) => !action.payload.some((deselectedEntry) => deselectedEntry.id === selectedEntry.id)
      );
      state.status = 'selecting';
    },
    enterSingleEdit: (state, action: PayloadAction<Attendance>) => {
      return {
        ...state,
        currentlyEditing: action.payload,
        status: 'editing',
      };
    },
    exitSingleEdit: (state) => {
      return {
        ...state,
        currentlyEditing: null,
        status: 'idle',
      };
    },
    enableSelection: (state) => {
      return {
        ...state,
        status: 'selecting',
      };
    },
    disableSelection: (state) => {
      return {
        ...state,
        selected: [],
        status: 'idle',
      };
    }
  },
});

export const { select, deselect, enterSingleEdit, exitSingleEdit, enableSelection, disableSelection } = attendanceSlice.actions;


export default attendanceSlice.reducer;
