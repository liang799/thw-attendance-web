import React, { ChangeEvent, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
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
import { CreateAttendanceData } from '@/utils/types/AttendanceData';
import { getUserId } from '@/utils/auth';
import { ApiClient } from '@/utils/axios';
import { useQuery, useQueryClient } from 'react-query';
import { attendanceOptions } from '@/config/attendanceOptions';
import AttendanceBadge from '@/components/attendance/AttendanceBadge';


type setterFunction = (showModal: boolean) => void;

type AttendanceModalProps = {
  attendanceId?: number | undefined,
  person?: string | undefined,
  showModal: boolean,
  setShowModal: setterFunction
}

export default function AttendanceModal({ attendanceId, person, showModal, setShowModal }: AttendanceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMcDates, setHasMcDates] = useState(false);
  const [hasDispatchLocation, setHasDispatchLocation] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading } = useQuery(`Get Attendance ${attendanceId}`,
    () => {
      return ApiClient.get(`/attendances/${attendanceId}`)
        .then(res => res.data);
    },
  );

  const handleClose = () => {
    setSelectedIndex(0);
    setDispatchLocation('');
    setHasMcDates(false);
    setHasDispatchLocation(false);
    setSelectedDates([new Date(), new Date()])
    setShowModal(false);
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
      await ApiClient.put(`/attendances/${attendanceId}`, data);
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
        <ModalHeader>Edit Attendance for {person}</ModalHeader>
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
            <Button mt={4} colorScheme='teal' onClick={onSubmit}>
              Submit
            </Button>
          </form>
        </ModalBody>

        <ModalFooter>
          <Skeleton isLoaded={!isLoading}>
            <Text>
              Last Known:
              <AttendanceBadge attendance={data} />
            </Text>
          </Skeleton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
