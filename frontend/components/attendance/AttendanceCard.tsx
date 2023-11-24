import { convertCapsWithSpacingToCamelCaseWithSpacing } from '@/utils/text';
import { Attendance } from '@/utils/types/AttendanceData';
import { Avatar, Box, Card, CardBody, CardProps, Checkbox, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import AttendanceBadge from '@/components/attendance/AttendanceBadge';
import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';


type AttendanceCardProps = {
  attendance: Attendance,
  isBulkEditing: boolean,
  handleClick: (attendance: Attendance) => void
} & CardProps

export default function AttendanceCard({ attendance, isBulkEditing, handleClick, ...props }: AttendanceCardProps) {
  const [isChecked, setChecked] = useState(false);

  const handleCardClick = () => {
    if (isBulkEditing) {
      setChecked(!isChecked);
    }
    handleClick(attendance);
  };

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      bg={isChecked ? useColorModeValue('blue.100', 'blue.700') : useColorModeValue('white', 'gray.700')}
      overflow='hidden'
      variant='outline'
      onClick={handleCardClick}
      cursor='pointer'
      {...props}
    >
      <CardBody>
        <Flex justify='space-between' alignItems='center'>
          <Box>
            <Flex alignItems='center'>
              {!isBulkEditing &&
                <Avatar />
              }
              {isBulkEditing &&
                <Checkbox isChecked={isChecked} />
              }
              <Box ml='3'>
                <Text fontWeight='bold'>
                  {`${attendance.user.rank} ${convertCapsWithSpacingToCamelCaseWithSpacing(attendance.user.name)}`}
                  <AttendanceBadge attendance={attendance} />
                </Text>
                <Text fontSize='xs'>{attendance.user.type}</Text>
              </Box>
            </Flex>
          </Box>
          {!isBulkEditing &&
            <EditIcon boxSize={5} color='gray.500' cursor='pointer' />
          }
        </Flex>
      </CardBody>
    </Card>
  );
}
