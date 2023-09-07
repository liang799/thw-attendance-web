import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useColorModeValue, useToast
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { ApiClient } from "@/utils/axios";
import { getUserId, useAuthentication } from '@/utils/auth';
import { CreateAttendanceData } from "@/utils/types/AttendanceData";
import Navbar from '@/components/Navbar';


const list = [
  { availability: "Expect Arrival", status: "Present" },
  { availability: "Expect Arrival", status: "Late" },
  { availability: "Dispatch", status: "Dispatch" },
  { availability: "Doctor", status: "RSO/RSI" },
  { availability: "Doctor", status: "MA (AM)" },
  { availability: "Doctor", status: "MA (PM)" },
  { availability: "Absent", status: "Off" },
  { availability: "Absent", status: "LVE/OL" },
  { availability: "Absent", status: "Course" },
  { availability: "Absent", status: "MC" }
];


export default function SubmitAttendancePage() {
  useAuthentication();

  const toast = useToast();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMcDates, setHasMcDates] = useState(false);
  const [hasDispatchLocation, setHasDispatchLocation] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

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
        absentStartDate: selectedDates[0],
        absentEndDate: selectedDates[1],
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
      await ApiClient.post("/attendances", data);
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

    if (list[value].availability === "Absent") {
      setHasMcDates(true);
      setHasDispatchLocation(false);
      return;
    }
    if (list[value].availability === "Dispatch") {
      setHasDispatchLocation(true);
      setHasMcDates(false);
      return;
    }
    setHasMcDates(false);
    setHasDispatchLocation(false);
  }

  return (
    <Container p={4} maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Navbar />
      <Stack p={4} spacing={4}>
        <Heading py={4}>Attendance</Heading>
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
      </Stack>
    </Container>
  );
}
