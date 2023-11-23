import React, { ChangeEvent, useRef, useState } from 'react';
import {
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
  Skeleton,
  Text,
  useToast,
} from '@chakra-ui/react';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { Attendance, CreateAttendanceData } from '@/utils/types/AttendanceData';
import { getUserId } from '@/utils/auth';
import { ApiClient } from '@/utils/axios';
import { useQuery, useQueryClient } from 'react-query';
import { attendanceOptions } from '@/config/attendanceOptions';
import AttendanceBadge from '@/components/attendance/AttendanceBadge';
import DeleteAttendanceButton from '@/components/attendance/DeleteAttendanceButton';
import NextLink from 'next/link';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { ParadeIdPageStatus } from '@/pages/parade/[slug]';


type AttendanceModalProps = {
  attendance: Attendance | null,
  showModal: boolean,
  setPageStatus: (status: ParadeIdPageStatus) => void,
}

export default function AttendanceModal({
  attendance,
  showModal,
  setPageStatus,
}: AttendanceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMcDates, setHasMcDates] = useState(false);
  const [hasDispatchLocation, setHasDispatchLocation] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleClose = () => {
    // setSelectedIndex(0);
    // setDispatchLocation('');
    // setHasMcDates(false);
    // setHasDispatchLocation(false);
    // setSelectedDates([new Date(), new Date()])
    setPageStatus(ParadeIdPageStatus.IDLE);
  };

  const onSubmit = async () => {
    let data: CreateAttendanceData;
    if (hasDispatchLocation) {
      data = {
        availability: attendanceOptions[selectedIndex].availability,
        status: attendanceOptions[selectedIndex].status,
        location: dispatchLocation,
        user: getUserId()
      };
    } else if (hasMcDates) {
      data = {
        availability: attendanceOptions[selectedIndex].availability,
        status: attendanceOptions[selectedIndex].status,
        absentStartDate: selectedDates[0],
        absentEndDate: selectedDates[1],
        user: getUserId()
      };
    } else {
      data = {
        availability: attendanceOptions[selectedIndex].availability,
        status: attendanceOptions[selectedIndex].status,
        user: getUserId()
      };
    }

    try {
      await ApiClient.put(`/attendances/${attendance?.id}`, data);
      await queryClient.invalidateQueries();
      toast({
        title: "Successful",
        description: "You have submitted your attendance",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (error: any) {
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
      setHasMcDates(true);
      setHasDispatchLocation(false);
      return;
    }
    if (attendanceOptions[value].availability === "Dispatch") {
      setHasDispatchLocation(true);
      setHasMcDates(false);
      return;
    }
    setHasMcDates(false);
    setHasDispatchLocation(false);
  }

  return (
    <Modal finalFocusRef={finalRef} isOpen={showModal} onClose={handleClose}>
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
            {hasDispatchLocation &&
              <FormControl>
                <FormLabel>Dispatch location</FormLabel>
                <Input onChange={(event) => setDispatchLocation(event.target.value)} />
              </FormControl>
            }
            {hasMcDates &&
              <FormControl>
                <FormLabel>MC Dates</FormLabel>
                <RangeDatepicker
                  selectedDates={selectedDates}
                  onDateChange={setSelectedDates}
                />
              </FormControl>
            }
            <HStack mt={4} spacing={4}>
              <Button colorScheme='teal' onClick={onSubmit}>
                Submit
              </Button>
              <DeleteAttendanceButton attendanceId={attendance?.id} handleClose={handleClose} />
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
