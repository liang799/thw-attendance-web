import { Attendance } from '@/utils/types/AttendanceData';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type initialStateType = {
  selected: Attendance[],
  lastClicked: Attendance | null,
  status: string,
};

const initialState: initialStateType = {
  selected: [],
  lastClicked: null,
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
    clickCard: (state, action: PayloadAction<Attendance>) => {
      return {
        ...state,
        lastClicked: action.payload,
        status: 'editing',
      };
    },
  },
});

export const { select, deselect, clickCard } = attendanceSlice.actions;


export default attendanceSlice.reducer;
