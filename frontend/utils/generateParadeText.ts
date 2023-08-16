import { ParadeData } from '@/utils/types/ParadeData';
import { DateTime } from 'luxon';
import { Attendance } from '@/utils/types/AttendanceData';

export default function generateParadeText(paradeData: ParadeData): string {
  return [
    `Parade State Summary`,
    `Node: THWHQ`,
    `Start Time: ${DateTime.fromISO(paradeData.startDate).toLocaleString(DateTime.DATETIME_FULL)}`,
    `End Time: ${paradeData.endDate ? DateTime.fromISO(paradeData.endDate).toLocaleString(DateTime.DATETIME_FULL) : '-'}`,
    ...paradeData?.attendances.map((attendance: Attendance) => {
      console.log(attendance?.id);
      return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
    }),
  ].join('\n');
  // setValue(copiedText);
}
