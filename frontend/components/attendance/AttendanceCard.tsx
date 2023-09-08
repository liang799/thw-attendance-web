import { convertCapsWithSpacingToCamelCaseWithSpacing } from '@/utils/text';
import { Attendance } from '@/utils/types/AttendanceData';
import HorizontalCard from '@/components/HorizontalCard';
import { Avatar, Box, CardBody, Flex, Link, Text } from '@chakra-ui/react';
import AttendanceBadge from '@/components/attendance/AttendanceBadge';


type AttendanceCardProps = {
  attendance: Attendance,
  handleClick: (attendance: Attendance) => void
}

export default function AttendanceCard({ attendance, handleClick }: AttendanceCardProps) {

  return (
    <Link key={attendance.id} onClick={() => handleClick(attendance)}>
      <HorizontalCard>
        <CardBody>
          <Flex>
            <Avatar />
            <Box ml='3'>
              <Text fontWeight='bold'>
                {`${attendance.user.rank} ${convertCapsWithSpacingToCamelCaseWithSpacing(attendance.user.name)}`}
                <AttendanceBadge attendance={attendance}/>
              </Text>
              <Text fontSize='sm'>{attendance.user.type}</Text>
            </Box>
          </Flex>
        </CardBody>
      </HorizontalCard>
    </Link>
  );

}
