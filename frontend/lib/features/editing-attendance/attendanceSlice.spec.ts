import { Attendance } from "@/utils/types/AttendanceData";
import attendanceSlice, { deselect, select } from "./attendance.slice";

describe('attendance editor reducer', () => {

  it('should handle initial state', () => {
    expect(attendanceSlice(undefined, { type: 'unknown' })).toEqual({
      selected: [],
      status: 'idle',
    });
  });


  it('should handle zero selection', () => {
    const initialState = {
      selected: [],
      status: 'idle',
    }
    expect(attendanceSlice(initialState, select([]))).toEqual({
      selected: [],
      status: 'selecting',
    });
  });

  it('should handle single selection', () => {
    const initialState = {
      selected: [],
      status: 'idle',
    }
    const attendace: Attendance = {
      id: 1,
      user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
      availability: { type: "", status: "", user: 0 },
      parade: 1,
      submittedAt: new Date(),
    }
    expect(attendanceSlice(initialState, select([attendace]))).toEqual({
      selected: [attendace],
      status: 'selecting',
    });
  });

  it('should handle multiple selection', () => {
    const date = new Date();

    const initialState = {
      selected: [
        {
          id: 1,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: new Date()
        }
      ],
      status: 'selecting',
    }
    const attendances: Attendance[] = [
      {
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: date,
      },
      {
        id: 3,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: date,
      }
    ]
    expect(attendanceSlice(initialState, select(attendances))).toEqual({
      selected: [
        {
          id: 1,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        },
        {
          id: 2,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        },
        {
          id: 3,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        }
      ],
      status: 'selecting',
    });
  });

  it('should handle single deselection', () => {
    const date = new Date();
    const initial = {
      selected: [
        {
          id: 2,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        },
        {
          id: 3,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        }
      ],
      status: 'selecting',
    }
    const deselected = [{
      id: 3,
      user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
      availability: { type: "", status: "", user: 0 },
      parade: 1,
      submittedAt: date,
    }]
    expect(attendanceSlice(initial, deselect(deselected))).toEqual({
      selected: [
        {
          id: 2,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        },
      ],
      status: 'selecting',
    });
  });

  it('should handle multiple deselection', () => {
    const date = new Date();
    const initial = {
      selected: [
        {
          id: 2,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        },
        {
          id: 3,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        }
      ],
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect(initial.selected))).toEqual({
      selected: [],
      status: 'selecting',
    });
  });

  it('should handle zero deselection', () => {
    const date = new Date();
    const initial = {
      selected: [
        {
          id: 2,
          user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
          availability: { type: "", status: "", user: 0 },
          parade: 1,
          submittedAt: date,
        },
      ],
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect([])))
      .toEqual(initial);
  });
});
