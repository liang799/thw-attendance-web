import { attendanceOptions } from "@/config/attendanceOptions";
import { ApiClient } from "@/utils/axios";
import { UpdateAttendanceData } from "@/utils/types/AttendanceData";
import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Select, Input, HStack, Button, ModalFooter } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useState, useRef, ChangeEvent } from "react";
import { useQueryClient } from "react-query";
import { AppState } from "@/lib/store";
import { useSelector } from "react-redux";

type AttendanceModalProps = {
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

export default function BulkEditingModalv2({ handleClose }: AttendanceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uiStatus, setUiStatus] = useState(UiStatus.SELECTING_DROPDOWN);
  const [dispatchLocation, setDispatchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const finalRef = useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const store = useSelector((state: AppState) => state.attendanceSlice);


  const onSubmit = async () => {
    setUiStatus(UiStatus.SUBMITTING);
    let data: UpdateAttendanceData;
    switch (uiStatus) {
      case UiStatus.INPUTTING_DISPATCH_LOC:
        data = {
          availability: attendanceOptions[selectedIndex].availability,
          status: attendanceOptions[selectedIndex].status,
          location: dispatchLocation,
        };
        break;
      case UiStatus.INPUTTING_MC_DATES:
        data = {
          availability: attendanceOptions[selectedIndex].availability,
          status: attendanceOptions[selectedIndex].status,
          absentStartDate: selectedDates[0],
          absentEndDate: selectedDates[1],
        };
        break;
      default:
        data = {
          availability: attendanceOptions[selectedIndex].availability,
          status: attendanceOptions[selectedIndex].status,
        };
        break;
    }

    const updatedList = store.selected.map((attendance) => {
      let copy = JSON.parse(JSON.stringify(data));
      copy.id = attendance.id;
      copy.user = attendance.user.id;
      return copy;
    });

    try {
      await ApiClient.put('/attendances', updatedList);
      setUiStatus(UiStatus.SUCCESS);
      handleClose();
      toast({
        title: "Successful",
        description: "Updated Attendances!",
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
            </HStack>
          </form>
        </ModalBody>

        <ModalFooter />

      </ModalContent>
    </Modal>
  );

}