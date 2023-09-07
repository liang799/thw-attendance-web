import { ParadeData } from '@/utils/types/ParadeData';
import { DateTime } from 'luxon';
import { Attendance, GetAttendanceData } from '@/utils/types/AttendanceData';

export default function generateParadeText(paradeData: ParadeData): string {
  const commanders = paradeData.attendances.filter(attendance => attendance.user.type == 'Commander');
  const s1People = paradeData.attendances.filter(attendance => attendance.user.type == 'S1 Branch');
  const s3People = paradeData.attendances.filter(attendance => attendance.user.type == 'S3 Branch');
  const s4People = paradeData.attendances.filter(attendance => attendance.user.type == 'S4 Branch');
  const transitionPeople = paradeData.attendances.filter(attendance => attendance.user.type == 'Transition');

  console.log(paradeData.summary);
  return [
    `Parade State Summary`,
    `Node: THWHQ`,
    `Time: ${DateTime.fromISO(paradeData.startDate).toFormat('dd MMM yyyy, HHmm')}`,

    '',

    ...paradeData.summary.map((availability) => {
      return `${availability.status || "Unknown"}: ${availability.count}`;
    }),

    '',

    'Commanders:',
    ...commanders.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${generateAttendanceStatus(attendance.availability)}`;
    }),

    '',

    'S3:',
    ...s3People.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${generateAttendanceStatus(attendance.availability)}`;
    }),

    '',

    'S1:',
    ...s1People.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${generateAttendanceStatus(attendance.availability)}`;
    }),

    '',

    'Transition:',
    ...transitionPeople.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${generateAttendanceStatus(attendance.availability)}`;
    }),

    '',

    'S4:',
    ...s4People.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${generateAttendanceStatus(attendance.availability)}`;
    }),

  ].join('\n');
}

function generateAttendanceStatus(data: GetAttendanceData): string {
  const availability = data.status;
  switch (availability) {
    case 'Dispatch':
      return `${data.status} - ${data.dispatchLocation}`;
    case 'Present':
      return `${data.status}`;
    case 'MC':
      if (!data.mcEndDate) return `${data.status} - No End date`;
      const date = DateTime.fromISO(data.mcEndDate).toFormat('ddLLyy');
      return `${data.status} - ${date}`;
    default:
      return data.status;
  }
}
