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
import { getUserId } from "@/utils/AuthService";


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

type AttendanceData = {
  availability: string,
  status: string,
  mcStartDate?: Date,
  mcEndDate?: Date,
  user: number,
  location?: string,
}

export default function SubmitAttendancePage() {
  const toast = useToast();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMcDates, setHasMcDates] = useState(false);
  const [hasDispatchLocation, setHasDispatchLocation] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

  const onSubmit = async () => {
    let data: AttendanceData;
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
      console.log(data);
      const response = await ApiClient.post("/attendances", data);
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
    <Container p={4} maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack spacing={4}>
        <Heading>Attendance</Heading>
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