import { ParadeData } from '@/utils/types/ParadeData';
import { DateTime } from 'luxon';
import { generateAttendanceStatus } from '@/utils/generateAttendanceStatus';

export default function generateParadeText(paradeData: ParadeData): string {
  const paradeDate = DateTime.fromISO(paradeData.startDate);
  const paradeDateWithTiming = includeParadeTiming(paradeDate);

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
    `Time: ${paradeDateWithTiming.toFormat('dd MMM yyyy, HHmm')}`,

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

function includeParadeTiming(paradeDate: DateTime): DateTime {
  const currentTime = DateTime.local();
  const isMorning = currentTime.hour < 12;
  if (isMorning) {
    return paradeDate.set({ hour: 8, minute: 0 });
  }
  return paradeDate.set({ hour: 13, minute: 30 });
}
