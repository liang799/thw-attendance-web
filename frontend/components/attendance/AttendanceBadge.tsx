import { Attendance } from '@/utils/types/AttendanceData';
import { Badge } from '@chakra-ui/react';
import { generateAttendanceStatus } from '@/utils/generateAttendanceStatus';

type AttendanceBadgeProps = {
  attendance: Attendance | null
}

export default function AttendanceBadge({ attendance }: AttendanceBadgeProps) {
  const determineAttendanceColor = (data: Attendance) => {
    if (data.availability.type === 'Present')
      return 'green';
    if (data.availability.type === 'Absent')
      return 'red';
    return 'yellow';
  };

  if (!attendance) {
    return (
      <Badge ml='2' mb='1' colorScheme='yellow'>
        Unknown
      </Badge>
    );
  }

  return (
    <Badge ml='2' mb='1' colorScheme={determineAttendanceColor(attendance)}>
      {generateAttendanceStatus(attendance.availability)}
    </Badge>
  );
}
