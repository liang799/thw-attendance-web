import React, { ChangeEvent, useRef, useState } from "react";
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
  useToast
} from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { Attendance, CreateAttendanceData } from "@/utils/types/AttendanceData";
import { getUserId } from "@/utils/auth";
import { ApiClient } from "@/utils/axios";
import { useQueryClient } from "react-query";
import { attendanceOptions } from '@/config/attendanceOptions';


type setterFunction = (showModal: boolean) => void;

type AttendanceModalProps = {
  attendance?: Attendance | null,
  showModal: boolean,
  setShowModal: setterFunction
}

export default function AttendanceModal({ attendance, showModal, setShowModal }: AttendanceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMcDates, setHasMcDates] = useState(false);
  const [hasDispatchLocation, setHasDispatchLocation] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const handleClose = () => {
    setHasMcDates(false);
    setHasDispatchLocation(false);
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

  function getPreviousResponse(): number {
    const previousAttendanceIndex = attendanceOptions.findIndex(value => value.status === attendance?.availability.status)
    return previousAttendanceIndex;
  }

  return (
    <Modal finalFocusRef={finalRef} isOpen={showModal} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Attendance for {attendance?.user.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select onChange={determineAdditionalInput} defaultValue={getPreviousResponse()}>
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
            <Button mt={4} colorScheme="teal" onClick={onSubmit}>
              Submit
            </Button>
          </form>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
