import { convertCapsWithSpacingToCamelCaseWithSpacing } from '@/utils/text';
import { Attendance } from '@/utils/types/AttendanceData';
import { Avatar, Box, Card, CardBody, CardProps, Checkbox, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import AttendanceBadge from '@/components/attendance/AttendanceBadge';
import { EditIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deselect, enterSingleEdit, select } from '@/lib/features/editing-attendance/attendance.slice';
import { AppState } from '@/lib/store';


type AttendanceCardProps = {
  attendance: Attendance,
} & CardProps

export default function AttendanceCard({ attendance, ...props }: AttendanceCardProps) {
  const checkedBackgroundColor = useColorModeValue('blue.100', 'blue.700');
  const backgroundColor = useColorModeValue('white', 'gray.700');

  const uiState = useSelector((state: AppState) => state.attendanceSlice);
  const dispatch = useDispatch();
  const isBulkEditing = uiState.status === "selecting";
  const isChecked = uiState.selected.some(selected => selected.id === attendance.id);

  const handleCardClick = () => {
    if (!isBulkEditing) {
      dispatch(enterSingleEdit(attendance));
      return;
    }

    if (isChecked) {
      dispatch(deselect([attendance]));
      return;
    }
    dispatch(select([attendance]));
  };

  return (
    <Card
      direction={{ base: 'column', sm: 'row' }}
      bg={isBulkEditing && isChecked ? checkedBackgroundColor : backgroundColor}
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
                <Checkbox as='div' isChecked={isChecked} />
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
