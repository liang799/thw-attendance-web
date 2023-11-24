import React, { ChangeEvent, useRef, useState } from 'react';
import {
  Badge,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { Attendance, CreateAttendanceData } from '@/utils/types/AttendanceData';
import { getUserId } from '@/utils/auth';
import { ApiClient } from '@/utils/axios';
import { useQueryClient } from 'react-query';
import { attendanceOptions } from '@/config/attendanceOptions';
import AttendanceBadge from '@/components/attendance/AttendanceBadge';
import DeleteAttendanceButton from '@/components/attendance/DeleteAttendanceButton';
import NextLink from 'next/link';
import { ExternalLinkIcon } from '@chakra-ui/icons';


type AttendanceModalProps = {
  attendance: Attendance | null,
  handleClose: () => void,
}

enum UiStatus {
  SELECTING_DROPDOWN,     // Default
  INPUTTING_DISPATCH_LOC,
  INPUTTING_MC_DATES,
  SUBMITTING,             // User Submit form
  SUCCESS,
  ERROR,
}

export default function AttendanceModal({ attendance, handleClose }: AttendanceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uiStatus, setUiStatus] = useState(UiStatus.SELECTING_DROPDOWN);
  const [dispatchLocation, setDispatchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const onSubmit = async () => {
    setUiStatus(UiStatus.SUBMITTING);
    let data: CreateAttendanceData;
    switch (uiStatus) {
      case UiStatus.INPUTTING_DISPATCH_LOC:
        data = {
          availability: attendanceOptions[selectedIndex].availability,
          status: attendanceOptions[selectedIndex].status,
          location: dispatchLocation,
          user: getUserId()
        };
        break;
      case UiStatus.INPUTTING_MC_DATES:
        data = {
          availability: attendanceOptions[selectedIndex].availability,
          status: attendanceOptions[selectedIndex].status,
          absentStartDate: selectedDates[0],
          absentEndDate: selectedDates[1],
          user: getUserId()
        };
        break;
      default:
        data = {
          availability: attendanceOptions[selectedIndex].availability,
          status: attendanceOptions[selectedIndex].status,
          user: getUserId()
        };
        break;
    }

    try {
      await ApiClient.put(`/attendances/${attendance?.id}`, data);
      setUiStatus(UiStatus.SUCCESS);
      toast({
        title: "Successful",
        description: "You have submitted your attendance",
        status: "success",
        duration: 5000,
        isClosable: true
      });
      await queryClient.invalidateQueries();
    } catch (error: any) {
      setUiStatus(UiStatus.ERROR);
      toast({
        title: error.name,
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  function determineAdditionalInput(event: ChangeEvent<HTMLSelectElement>) {
    const value = +event.target.value;
    setSelectedIndex(value);

    if (attendanceOptions[value].availability === "Absent") {
      setUiStatus(UiStatus.INPUTTING_MC_DATES);
      return;
    }
    if (attendanceOptions[value].availability === "Dispatch") {
      setUiStatus(UiStatus.INPUTTING_DISPATCH_LOC);
      return;
    }
    setUiStatus(UiStatus.SELECTING_DROPDOWN);
  }

  if (uiStatus === UiStatus.SUCCESS || uiStatus === UiStatus.ERROR) {
    handleClose();
    return <></>;
  }

  return (
    <Modal finalFocusRef={finalRef} isOpen={true} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Edit Attendance for {' '}
          <Link as={NextLink} color='teal.500' href={`/user/${attendance?.user.id}`}>
            {attendance?.user.name} <ExternalLinkIcon mx='2px' />
          </Link>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select onChange={determineAdditionalInput}>
                {attendanceOptions.map((data, index) => (
                  <option key={index} value={index}>{data.status}</option>
                ))}
              </Select>
            </FormControl>
            {uiStatus === UiStatus.INPUTTING_DISPATCH_LOC &&
              <FormControl>
                <FormLabel>Dispatch location</FormLabel>
                <Input onChange={(event) => setDispatchLocation(event.target.value)} />
              </FormControl>
            }
            {uiStatus === UiStatus.INPUTTING_MC_DATES &&
              <FormControl>
                <FormLabel>MC Dates</FormLabel>
                <RangeDatepicker
                  selectedDates={selectedDates}
                  onDateChange={setSelectedDates}
                />
              </FormControl>
            }
            <HStack mt={4} spacing={4}>
              <Button isLoading={uiStatus === UiStatus.SUBMITTING} colorScheme='teal' onClick={onSubmit}>
                Submit
              </Button>
              {uiStatus !== UiStatus.SUBMITTING &&
                <DeleteAttendanceButton attendanceId={attendance?.id} handleClose={handleClose} />
              }
            </HStack>
          </form>
        </ModalBody>

        <ModalFooter>
          <Text>
            Last Known:
            <AttendanceBadge attendance={attendance} />
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
