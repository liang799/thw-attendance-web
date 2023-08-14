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
import { CreateAttendanceData } from "@/utils/types/AttendanceData";
import { getUserId } from "@/utils/AuthService";
import { ApiClient } from "@/utils/axios";
import { useQueryClient } from "react-query";

const list = [
  { availability: "No MC", status: "Present" },
  { availability: "Dispatch", status: "Dispatch" },
  { availability: "No MC", status: "Late" },
  { availability: "Might Have MC", status: "RSO/RSI" },
  { availability: "Might Have MC", status: "MA (AM)" },
  { availability: "Might Have MC", status: "MA (PM)" },
  { availability: "Absent", status: "Off" },
  { availability: "Absent", status: "LVE/OL" },
  { availability: "Absent", status: "Course" },
  { availability: "Absent", status: "MC" }
];


type setterFunction = (showModal: boolean) => void;

type AttendanceModalProps = {
  attendanceId: number,
  name: string
  showModal: boolean,
  setShowModal: setterFunction
}

export default function AttendanceModal({ attendanceId, name, showModal, setShowModal }: AttendanceModalProps) {
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
        availability: list[selectedIndex].availability,
        status: list[selectedIndex].status,
        location: dispatchLocation,
        user: getUserId()
      };
    } else if (hasMcDates) {
      data = {
        availability: list[selectedIndex].availability,
        status: list[selectedIndex].status,
        mcStartDate: selectedDates[0],
        mcEndDate: selectedDates[1],
        user: getUserId()
      };
    } else {
      data = {
        availability: list[selectedIndex].availability,
        status: list[selectedIndex].status,
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

    if (list[value].status === "MC") {
      setHasMcDates(true);
      setHasDispatchLocation(false);
      return;
    }
    if (list[value].status === "Dispatch") {
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
        <ModalHeader>Edit Attendance for {name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select onChange={determineAdditionalInput}>
                {list.map((data, index) => (
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
