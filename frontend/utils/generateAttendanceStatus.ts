import { GetAttendanceData } from '@/utils/types/AttendanceData';
import { attendanceOptions } from '@/config/attendanceOptions';
import { DateTime } from 'luxon';

export function generateAttendanceStatus(data: GetAttendanceData): string {
  const attendanceType = attendanceOptions.find(option => option.status == data.status)
  if (!attendanceType) return '';
  switch (attendanceType.availability) {
    case 'Dispatch':
      return `${data.status} - ${data.dispatchLocation}`;
    case 'Expect Arrival':
    case 'WFH':
    case 'Doctor':
      return `${data.status}`;
    case 'Absent':
      if (!data.absentEndDate) return `${data.status} - No End date`;
      const date = DateTime.fromISO(data.absentEndDate).toFormat('ddLLyy');
      return `${data.status} - ${date}`;
    default:
      return '';
  }
}
