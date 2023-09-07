import { Availability } from './Availability';
import { AttendanceStatus } from '../../dto/attendance-status';
import { CreateAttendanceDto } from '../../dto/create-attendance.dto';

export default class AvailabilityFactory {
  createAvailability(dto: CreateAttendanceDto): Availability {
    switch (dto.availability) {
      case AttendanceStatus.DISPATCH:
        return Availability.dispatchTo(dto.location);
      case AttendanceStatus.EXPECT_ARRIVAL:
        return Availability.willBeInCamp(dto.status);
      case AttendanceStatus.DOCTOR:
        return Availability.seeDoctor(dto.status);
      case AttendanceStatus.ABSENT:
        return Availability.absent(
          dto.status,
          new Date(dto.absentStartDate),
          new Date(dto.absentEndDate),
        );
    }
  }
}
