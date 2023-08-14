import { Availability } from '../../attendances/value-objects/Availability';

function tallyAttendance(attendances: Availability[]): Record<string, number> {
  const summary: Record<string, number> = {};

  for (const attendance of attendances) {
    const status = attendance.status;
    summary[status] = (summary[status] || 0) + 1;
  }

  return summary;
}

describe('Algorithm to tally statuses', () => {
  it('It should be 2 when there are 2 people present', () => {
    const attendances = [
      Availability.noMC('Present'),
      Availability.noMC('Present'),
    ];
    const data = tallyAttendance(attendances);
    expect(data).toEqual({ Present: 2 });
  });

  it('It should report that 2 MA (AM) and 1 Present', () => {
    const attendances = [
      Availability.noMC('Present'),
      Availability.mightHaveMc('MA (AM)'),
      Availability.noMC('MA (AM)'),
    ];
    const data = tallyAttendance(attendances);
    expect(data).toEqual({ 'MA (AM)': 2, Present: 1 });
  });
});
