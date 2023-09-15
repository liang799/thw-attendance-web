import { convertCapsWithSpacingToCamelCaseWithSpacing } from '@/utils/text';
import { Attendance } from '@/utils/types/AttendanceData';
import { Avatar, Box, Card, CardBody, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import AttendanceBadge from '@/components/attendance/AttendanceBadge';
import { EditIcon } from '@chakra-ui/icons';


type AttendanceCardProps = {
  attendance: Attendance,
  handleClick: (attendance: Attendance) => void
}

export default function AttendanceCard({ attendance, handleClick }: AttendanceCardProps) {

  return (
    <Link key={attendance.id} onClick={() => handleClick(attendance)}>
      <Card
        direction={{ base: "column", sm: "row" }}
        bg={useColorModeValue("white", "gray.700")}
        overflow="hidden"
        variant="outline"
      >
        <CardBody>
          <Flex justify="space-between" alignItems="center">
            <Box>
              <Flex alignItems="center">
                <Avatar />
                <Box ml='3'>
                  <Text fontWeight='bold'>
                    {`${attendance.user.rank} ${convertCapsWithSpacingToCamelCaseWithSpacing(attendance.user.name)}`}
                    <AttendanceBadge attendance={attendance}/>
                  </Text>
                  <Text fontSize='xs'>{attendance.user.type}</Text>
                </Box>
              </Flex>
            </Box>
            <EditIcon
              boxSize={5}
              color="gray.500"
              cursor="pointer"
            />
          </Flex>
        </CardBody>
      </Card>
    </Link>

  );

}
