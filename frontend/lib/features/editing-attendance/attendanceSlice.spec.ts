import { Attendance } from "@/utils/types/AttendanceData";
import attendanceSlice, { deselect, disableSelection, exitSingleEdit, enableSelection, enterSingleEdit, select, enterAttendanceCreation, exitAttendanceCreation } from "./attendance.slice";

describe('attendance editor reducer', () => {

  it('should handle initial state', () => {
    expect(attendanceSlice(undefined, { type: 'unknown' })).toEqual({
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    });
  });

  it('should enable selection', () => {
    const initialState = {
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    };

    expect(attendanceSlice(initialState, enableSelection())).toEqual({
      selected: [],
      currentlyEditing: null,
      status: 'selecting',
    });

  })

  it('should clear selection array when selection is disabled', () => {
    const initialState = {
      selected: [{
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: new Date(),
      }],
      currentlyEditing: null,
      status: 'idle',
    };

    expect(attendanceSlice(initialState, disableSelection())).toEqual({
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    });
  });

  it('should handle zero selection', () => {
    const initialState = {
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    }
    expect(attendanceSlice(initialState, select([]))).toEqual({
      selected: [],
      currentlyEditing: null,
      status: 'selecting',
    });
  });

  it('should handle single selection', () => {
    const initialState = {
      selected: [],
      currentlyEditing: null,
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
      currentlyEditing: null,
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
      currentlyEditing: null,
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
      currentlyEditing: null,
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
      currentlyEditing: null,
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
      currentlyEditing: null,
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
      currentlyEditing: null,
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect(initial.selected))).toEqual({
      selected: [],
      currentlyEditing: null,
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
      currentlyEditing: null,
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect([])))
      .toEqual(initial);
  });

  it('should store attendance when entering single editing mode', () => {
    const initialState = {
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    }
    const attendace = {
      id: 2,
      user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
      availability: { type: "", status: "", user: 0 },
      parade: 1,
      submittedAt: new Date(),
    }
    expect(attendanceSlice(initialState, enterSingleEdit(attendace))).toEqual({
      selected: [],
      currentlyEditing: attendace,
      status: 'editing',
    });
  })

  it('should clear last clicked when exiting single editing mode', () => {
    const initialState = {
      selected: [],
      currentlyEditing: {
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: new Date(),
      },
      status: 'editing',
    }
    expect(attendanceSlice(initialState, exitSingleEdit())).toEqual({
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    });
  });

  it('should switch to attendance creation mode', () => {
    const initialState = {
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    }
    expect(attendanceSlice(initialState, enterAttendanceCreation())).toEqual({
      selected: [],
      currentlyEditing: null,
      status: 'creating',
    });
  });

  it('should exit from attendance creation mode', () => {
    const initialState = {
      selected: [],
      currentlyEditing: null,
      status: 'creating',
    }
    expect(attendanceSlice(initialState, exitAttendanceCreation())).toEqual({
      selected: [],
      currentlyEditing: null,
      status: 'idle',
    });
  });
});
