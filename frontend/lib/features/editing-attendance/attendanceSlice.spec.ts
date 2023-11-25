import { Attendance } from "@/utils/types/AttendanceData";
import attendanceSlice, { clickCard, deselect, select } from "./attendance.slice";

describe('attendance editor reducer', () => {

  it('should handle initial state', () => {
    expect(attendanceSlice(undefined, { type: 'unknown' })).toEqual({
      selected: [],
      lastClicked: null,
      status: 'idle',
    });
  });


  it('should handle zero selection', () => {
    const initialState = {
      selected: [],
      lastClicked: null,
      status: 'idle',
    }
    expect(attendanceSlice(initialState, select([]))).toEqual({
      selected: [],
      lastClicked: null,
      status: 'selecting',
    });
  });

  it('should handle single selection', () => {
    const initialState = {
      selected: [],
      lastClicked: null,
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
      lastClicked: null,
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
      lastClicked: null,
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
      lastClicked: null,
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
      lastClicked: null,
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
      lastClicked: null,
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
      lastClicked: null,
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect(initial.selected))).toEqual({
      selected: [],
      lastClicked: null,
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
      lastClicked: null,
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect([])))
      .toEqual(initial);
  });

  it('should remember last clicked', () => {
    const initialState = {
      selected: [],
      lastClicked: null,
      status: 'idle',
    }
    const attendace = {
      id: 2,
      user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
      availability: { type: "", status: "", user: 0 },
      parade: 1,
      submittedAt: new Date(),
    }
    expect(attendanceSlice(initialState, clickCard(attendace))).toEqual({
      selected: [],
      lastClicked: attendace,
      status: 'editing',
    });
  })

  it('should replace last clicked', () => {
    const initialState = {
      selected: [],
      lastClicked: {
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: new Date(),
      },
      status: 'idle',
    }
    const attendace = {
      id: 5,
      user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
      availability: { type: "", status: "", user: 0 },
      parade: 1,
      submittedAt: new Date(),
    }
    expect(attendanceSlice(initialState, clickCard(attendace))).toEqual({
      selected: [],
      lastClicked: attendace,
      status: 'editing',
    });
  })
});
