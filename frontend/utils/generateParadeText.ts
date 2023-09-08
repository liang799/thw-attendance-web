import { ParadeData } from '@/utils/types/ParadeData';
import { DateTime } from 'luxon';
import { GetAttendanceData } from '@/utils/types/AttendanceData';
import { attendanceOptions } from '@/config/attendanceOptions';

export default function generateParadeText(paradeData: ParadeData): string {

  const branches = paradeData.strength.map(strength => {
    let branch = `${strength.type}: ${strength.present}/${strength.total}\n`;
    paradeData.attendances
      .filter(attendance => attendance.user.type == strength.type)
      .map(attendance => {
        branch += `${attendance.user.rank} ${attendance.user.name} - ${generateAttendanceStatus(attendance.availability)}\n`;
      });
    return branch;
  });


  return [
    `Parade State Summary`,
    `Node: THWHQ`,
    `Time: ${DateTime.fromISO(paradeData.startDate).toFormat('dd MMM yyyy, HHmm')}`,

    '',

    ...paradeData.summary.map((availability) => {
      return `${availability.status || 'Unknown'}: ${availability.count}`;
    }),

    '',

    'MC:',
    ...paradeData.attendances
      .filter(attendance => attendance.availability.status == 'MC')
      .map((attendance) => {
        if (attendance.availability?.absentEndDate == null) {
          return `${attendance.user.name} - Unknown`;
        }
        const date = DateTime.fromISO(attendance.availability.absentEndDate).toFormat('ddLLyy');
        return `${attendance.user.name} - ${date}`;
      }),

    '',

    ...branches.map(branchData => {
      return branchData;
    }),

    '',
  ].join('\n');
}

function generateAttendanceStatus(data: GetAttendanceData): string {
  const attendanceType = attendanceOptions.find(option => option.status == data.status)
  if (!attendanceType) return '';
  switch (attendanceType.availability) {
    case 'Dispatch':
      return `${data.status} - ${data.dispatchLocation}`;
    case 'Expect Arrival':
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
