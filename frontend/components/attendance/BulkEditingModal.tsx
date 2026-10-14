import { attendanceOptions } from "@/config/attendanceOptions";
import { ApiClient } from "@/utils/axios";
import { UpdateAttendanceData } from "@/utils/types/AttendanceData";
import { useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Select, Input, HStack, Button, ModalFooter } from "@chakra-ui/react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { useState, useRef, useId, FormEvent } from "react";
import { useMutation, useQueryClient } from "react-query";
import { NonEmptyAttendanceSelection } from "@/lib/features/editing-attendance/attendance.slice";

type AttendanceModalProps = {
  selected: NonEmptyAttendanceSelection,
  handleClose: () => void,
}

export default function BulkEditingModalv2({ selected, handleClose }: AttendanceModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dispatchLocation, setDispatchLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const selectedOption = attendanceOptions[selectedIndex];
  const mcDatesId = useId();
  const finalRef = useRef(null);
  const queryClient = useQueryClient();
  const toast = useToast();

  const saveAttendance = useMutation(
    (data: UpdateAttendanceData) => ApiClient.put('/attendances', selected.map(attendance => ({
      ...data,
      id: attendance.id,
      user: attendance.user.id,
    }))),
    {
      onSuccess: () => {
        void queryClient.invalidateQueries();
        handleClose();
        toast({
          title: "Successful",
          description: "Updated Attendances!",
          status: "success",
          duration: 5000,
          isClosable: true
        });
      },
      onError: (error: Error) => {
        toast({
          title: error.name,
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true
        });
      },
    },
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saveAttendance.isLoading) return;

    const data: UpdateAttendanceData = { ...selectedOption };
    if (selectedOption.availability === 'Dispatch') {
      data.location = dispatchLocation;
    } else if (selectedOption.availability === 'Absent') {
      data.absentStartDate = selectedDates[0];
      data.absentEndDate = selectedDates[1];
    }
    saveAttendance.mutate(data);
  };

  return (
    <Modal
      finalFocusRef={finalRef}
      isOpen={true}
      onClose={() => { if (!saveAttendance.isLoading) handleClose(); }}
      closeOnEsc={!saveAttendance.isLoading}
      closeOnOverlayClick={!saveAttendance.isLoading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set attendance for selected users</ModalHeader>
        <ModalCloseButton isDisabled={saveAttendance.isLoading} />

        <ModalBody>
          <form onSubmit={onSubmit}>
            <FormControl isDisabled={saveAttendance.isLoading}>
              <FormLabel>Status</FormLabel>
              <Select value={selectedIndex} onChange={(event) => setSelectedIndex(+event.target.value)}>
                {attendanceOptions.map((data, index) => (
                  <option key={index} value={index}>{data.status}</option>
                ))}
              </Select>
            </FormControl>
            {selectedOption.availability === 'Dispatch' &&
              <FormControl isDisabled={saveAttendance.isLoading}>
                <FormLabel>Dispatch location</FormLabel>
                <Input value={dispatchLocation} onChange={(event) => setDispatchLocation(event.target.value)} />
              </FormControl>
            }
            {selectedOption.availability === 'Absent' &&
              <FormControl id={mcDatesId} isDisabled={saveAttendance.isLoading}>
                <FormLabel>MC Dates</FormLabel>
                <RangeDatepicker
                  propsConfigs={{ inputProps: { 'aria-labelledby': `${mcDatesId}-label` } }}
                  disabled={saveAttendance.isLoading}
                  selectedDates={selectedDates}
                  onDateChange={setSelectedDates}
                />
              </FormControl>
            }
            <HStack mt={4} spacing={4}>
              <Button isLoading={saveAttendance.isLoading} colorScheme='teal' type='submit'>
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
