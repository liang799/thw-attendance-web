import { Attendance } from "@/utils/types/AttendanceData";
import attendanceSlice, { deselect, disableSelection, exitSingleEdit, enableSelection, enterSingleEdit, select, enterAttendanceCreation, exitAttendanceCreation, enterBulkEditing, exitBulkEditing, deselectAll, setTabIndex } from "./attendance.slice";

describe('attendance editor reducer', () => {

  it('should handle initial state', () => {
    expect(attendanceSlice(undefined, { type: 'unknown' })).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    });
  });

  it('should enable selection', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    };

    expect(attendanceSlice(initialState, enableSelection())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    });

  })

  it('should clear selection array when selection is disabled', () => {
    const initialState = {
      selected: [{
        editSelected: false,
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: new Date(),
      }],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    };

    expect(attendanceSlice(initialState, disableSelection())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    });
  });

  it('should handle zero selection', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    }
    expect(attendanceSlice(initialState, select([]))).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    });
  });

  it('should handle single selection', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect(initial.selected))).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselect([])))
      .toEqual(initial);
  });

  it('should clear all selection', () => {
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
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    }
    expect(attendanceSlice(initial, deselectAll())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    });
  });

  it('should store attendance when entering single editing mode', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
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
      editSelected: false,
      currentlyEditing: attendace,
      tabIndex: 0,
      status: 'editing',
    });
  })

  it('should clear last clicked when exiting single editing mode', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: {
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: new Date(),
      },
      tabIndex: 0,
      status: 'editing',
    }
    expect(attendanceSlice(initialState, exitSingleEdit())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    });
  });

  it('should switch to attendance creation mode', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    }
    expect(attendanceSlice(initialState, enterAttendanceCreation())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'creating',
    });
  });

  it('should exit from attendance creation mode', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'creating',
    }
    expect(attendanceSlice(initialState, exitAttendanceCreation())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    });
  });

  it('should not enter bulk editing mode when no attendances are selected', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    }
    expect(attendanceSlice(initialState, enterBulkEditing())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    });
  })

  it('should enter bulk editing mode when selection is not empty', () => {
    const sumbmittedDate = new Date();
    const initialState = {
      selected: [{
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: sumbmittedDate,
      }],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    }
    expect(attendanceSlice(initialState, enterBulkEditing())).toEqual({
      selected: [{
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: sumbmittedDate
      }],
      editSelected: true,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    });
  })

  it('should clear selection when exiting bulk editing', () => {
    const initialState = {
      selected: [{
        id: 2,
        user: { id: 1, type: "", rank: "", name: "", hasLeftNode: false },
        availability: { type: "", status: "", user: 0 },
        parade: 1,
        submittedAt: new Date(),
      }],
      editSelected: true,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    }
    expect(attendanceSlice(initialState, exitBulkEditing())).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'selecting',
    });
  })

  it('should set tab index', () => {
    const initialState = {
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 0,
      status: 'idle',
    }
    expect(attendanceSlice(initialState, setTabIndex(1))).toEqual({
      selected: [],
      editSelected: false,
      currentlyEditing: null,
      tabIndex: 1,
      status: 'idle',
    });
  })
});
