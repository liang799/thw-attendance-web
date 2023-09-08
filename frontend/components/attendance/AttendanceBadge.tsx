import { Attendance, GetAttendanceData } from '@/utils/types/AttendanceData';
import { DateTime } from 'luxon';
import { Badge, Text } from '@chakra-ui/react';

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

function generateAttendanceStatus(data: GetAttendanceData) {
  const availability = data.status;
  switch (availability) {
    case 'Dispatch':
      return <Text>{`${data.status} - ${data.dispatchLocation}`}</Text>;
    case 'Present':
      return <Text>{`${data.status}`}</Text>;
    case 'MC':
      if (!data.absentEndDate) return <Text>{`${data.status} - No End date`}</Text>;
      const date = DateTime.fromISO(data.absentEndDate).toFormat('ddLLyy');
      return <Text>{`${data.status} - ${date}`}</Text>;
    default:
      return <Text>{data.status}</Text>;
  }
}
