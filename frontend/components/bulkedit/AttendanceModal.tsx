import React, { ChangeEvent, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import { RangeDatepicker } from 'chakra-dayzed-datepicker';
import { CreateAttendanceData } from '@/utils/types/AttendanceData';
import { attendanceOptions } from '@/config/attendanceOptions';


type setterFunction = (showModal: boolean) => void;

type AttendanceModalProps = {
  showModal: boolean,
  setShowModal: setterFunction,
  setData: (data: CreateAttendanceData) => void;
}

export default function BulkEditAttendanceModal({ showModal, setShowModal, setData }: AttendanceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMcDates, setHasMcDates] = useState(false);
  const [hasDispatchLocation, setHasDispatchLocation] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const finalRef = useRef(null);


  const handleClose = () => {
    setSelectedIndex(0);
    setDispatchLocation('');
    setHasMcDates(false);
    setHasDispatchLocation(false);
    setSelectedDates([new Date(), new Date()]);
    setShowModal(false);
  };

  const onSubmit = async () => {
    let data: CreateAttendanceData;
    if (hasDispatchLocation) {
      data = {
        availability: attendanceOptions[selectedIndex].availability,
        status: attendanceOptions[selectedIndex].status,
        location: dispatchLocation,
        user: -1,
      };
    } else if (hasMcDates) {
      data = {
        availability: attendanceOptions[selectedIndex].availability,
        status: attendanceOptions[selectedIndex].status,
        absentStartDate: selectedDates[0],
        absentEndDate: selectedDates[1],
        user: -1,
      };
    } else {
      data = {
        availability: attendanceOptions[selectedIndex].availability,
        status: attendanceOptions[selectedIndex].status,
        user: -1,
      };
    }
    setData(data);
  };

  function determineAdditionalInput(event: ChangeEvent<HTMLSelectElement>) {
    const value = +event.target.value;
    setSelectedIndex(value);

    if (attendanceOptions[value].availability === 'Absent') {
      setHasMcDates(true);
      setHasDispatchLocation(false);
      return;
    }
    if (attendanceOptions[value].availability === 'Dispatch') {
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
        <ModalHeader>Set attendance for selected users</ModalHeader>
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
            </HStack>
          </form>
        </ModalBody>
        <ModalFooter/>
      </ModalContent>
    </Modal>
  );
};
