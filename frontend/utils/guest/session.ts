import type { Attendance } from '@/utils/types/AttendanceData';
import type { ParadeListItem } from '@/utils/types/ParadeListItem';
import type { UserData } from '@/utils/types/UserData';

const MODE_KEY = 'thw-guest-mode';
const DATA_KEY = 'thw-guest-data-v1';
export const GUEST_USER_ID = 1;
export const GUEST_BRANCHES = ['Commander', 'S1 Branch', 'S3 Branch', 'S4 Branch', 'Media Team', 'Transition'];

export type GuestData = {
  users: UserData[];
  parades: ParadeListItem[];
  attendances: Attendance[];
  nextId: number;
};

export function isGuestMode(): boolean {
  return typeof window !== 'undefined' && window.sessionStorage.getItem(MODE_KEY) === 'true';
}

function createGuestData(): GuestData {
  const now = new Date();
  const date = (daysAgo: number) => {
    const value = new Date(now);
    value.setDate(value.getDate() - daysAgo);
    value.setHours(8, 0, 0, 0);
    return value.toISOString();
  };
  const people = [
    ['CPT', 'Alex Tan', 'Commander'], ['LTA', 'Jamie Lee', 'Commander'],
    ['3SG', 'Sam Lim', 'S1 Branch'], ['CPL', 'Morgan Chen', 'S1 Branch'],
    ['3SG', 'Jordan Teo', 'S3 Branch'], ['CPL', 'Casey Ng', 'S3 Branch'],
    ['3SG', 'Taylor Goh', 'S4 Branch'], ['LCP', 'Riley Koh', 'S4 Branch'],
    ['CPL', 'Avery Wong', 'Media Team'], ['LCP', 'Quinn Chua', 'Media Team'],
    ['PTE', 'Drew Low', 'Transition'], ['PTE', 'Robin Yeo', 'Transition'],
  ];
  const users = people.map(([rank, name, type], index) => ({
    id: index + 1, rank, name, type, hasLeftNode: false,
  }));
  const parades = [
    { id: 103, startDate: date(0) },
    { id: 102, startDate: date(1), endDate: date(0) },
    { id: 101, startDate: date(2), endDate: date(1) },
  ];
  const statuses = ['Present', 'Late', 'Present', 'MC', 'Dispatch', 'Present', 'Work From Home', 'Off', 'Present', 'MA (AM)', 'Present', 'Present'];
  const attendances = parades.flatMap((parade, paradeIndex) => users
    // Leave one person to add using the New Attendance workflow.
    .filter(user => paradeIndex > 0 || user.id !== 12)
    .map((user, index): Attendance => {
      const status = paradeIndex === 0 ? statuses[index] : 'Present';
      return {
        id: parade.id * 100 + user.id,
        user,
        parade: parade.id,
        submittedAt: new Date(parade.startDate),
        availability: {
          user: user.id,
          type: ['MC', 'Off', 'MA (AM)'].includes(status) ? 'Absent' : 'Present',
          status,
          ...(status === 'Dispatch' ? { dispatchLocation: 'Training Centre' } : {}),
          ...(['MC', 'Off'].includes(status) ? { absentStartDate: date(0), absentEndDate: date(0) } : {}),
        },
      };
    }));
  return { users, parades, attendances, nextId: 20000 };
}

export function saveGuestData(data: GuestData) {
  window.sessionStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function startGuestSession() {
  saveGuestData(createGuestData());
  window.sessionStorage.setItem(MODE_KEY, 'true');
}

export function endGuestSession() {
  window.sessionStorage.removeItem(MODE_KEY);
  window.sessionStorage.removeItem(DATA_KEY);
}

export function readGuestData(): GuestData {
  if (!isGuestMode()) throw new Error('Guest mode is not active.');
  const saved = window.sessionStorage.getItem(DATA_KEY);
  if (saved) {
    try {
      const data: GuestData = JSON.parse(saved);
      if (Array.isArray(data.users) && Array.isArray(data.parades) && Array.isArray(data.attendances) && Number.isInteger(data.nextId)) {
        return data;
      }
    } catch {
      // Recover demo data without ever falling back to the real API.
    }
  }
  const data = createGuestData();
  saveGuestData(data);
  return data;
}
