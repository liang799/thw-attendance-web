import { ParadeData } from '@/utils/types/ParadeData';
import { DateTime } from 'luxon';
import { Attendance } from '@/utils/types/AttendanceData';

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

    ...Object.keys(paradeData.summary).map((submittedStatus) => {
      return `${submittedStatus}: ${paradeData.summary[submittedStatus]}`;
    }),

    '',

    'Commanders:',
    ...commanders.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
    }),

    '',

    'S3:',
    ...s3People.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
    }),

    '',

    'S1:',
    ...s1People.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
    }),

    '',

    'Transition:',
    ...transitionPeople.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
    }),

    '',

    'S4:',
    ...s4People.map((attendance: Attendance) => {
      return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
    }),

  ].join('\n');
}
