import { ParadeData } from '@/utils/types/ParadeData';
import { DateTime } from 'luxon';
import { Attendance } from '@/utils/types/AttendanceData';

export default function generateParadeText(paradeData: ParadeData): string {
  return [
    `Parade State Summary`,
    `Node: THWHQ`,
    `Time: ${DateTime.fromISO(paradeData.startDate).toFormat('dd MMM yyyy, hhmm')}`,
    '',
    ...paradeData?.attendances.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
    }),
  ].join('\n');
}
