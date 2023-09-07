import { convertCapsWithSpacingToCamelCaseWithSpacing } from '@/utils/text';
import { Attendance, GetAttendanceData } from '@/utils/types/AttendanceData';
import { DateTime } from 'luxon';
import HorizontalCard from '@/components/HorizontalCard';
import { Avatar, Badge, Box, CardBody, Flex, Link, Text } from '@chakra-ui/react';


type AttendanceCardProps = {
  attendance: Attendance,
  handleClick: (attendance: Attendance) => void
}

export default function AttendanceCard({ attendance, handleClick }: AttendanceCardProps) {
  const determineAttendanceColor = (data: Attendance) => {
    if (data.availability.type === 'Present')
      return 'green';
    if (data.availability.type === 'Absent')
      return 'red';
    return 'yellow';
  };

  return (
    <Link key={attendance.id} onClick={() => handleClick(attendance)}>
      <HorizontalCard>
        <CardBody>
          <Flex>
            <Avatar />
            <Box ml='3'>
              <Text fontWeight='bold'>
                {`${attendance.user.rank} ${convertCapsWithSpacingToCamelCaseWithSpacing(attendance.user.name)}`}
                <Badge ml='2' mb='1' colorScheme={determineAttendanceColor(attendance)}>
                  {generateAttendanceStatus(attendance.availability)}
                </Badge>
              </Text>
              <Text fontSize='sm'>{attendance.user.type}</Text>
            </Box>
          </Flex>
        </CardBody>
      </HorizontalCard>
    </Link>
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
