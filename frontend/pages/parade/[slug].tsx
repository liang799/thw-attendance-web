import {
  Button,
  CardBody,
  Container, FormControl, FormLabel,
  Heading, Input,
  Link,
  Modal,
  ModalBody, ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Select,
  Skeleton,
  Stack,
  Text,
  useColorModeValue, useDisclosure, useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import { ReactQueryKey } from "@/utils/react-query-keys";
import { ApiClient } from "@/utils/axios";
import GenericErrorDisplay from "@/components/GenericErrorDisplay";
import { Attendance, AttendanceData } from "@/utils/types/AttendanceData";
import HorizontalCard from "@/components/HorizontalCard";
import { ChangeEvent, useRef, useState } from "react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
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

function generateAttendanceStatus(data: AttendanceData) {
  const availability = data.status;
  switch (availability) {
    case "Dispatch":
      return <Text>{`${data.status} - ${data.dispatchLocation}`}</Text>;
    case "Present":
      return <Text>{`${data.status}`}</Text>;
    case "MC":
      return <Text>{`${data.status} - ${data.mcEndDate}`}</Text>;
    default:
      return <Text>{data.status}</Text>;
  }

}


export default function ParadeIdPage() {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const finalRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [attendance, setAttendance] = useState<Attendance>();
  const router = useRouter();
  const { slug } = router.query;
  const toast = useToast();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasMcDates, setHasMcDates] = useState(false);
  const [hasDispatchLocation, setHasDispatchLocation] = useState(false);
  const [dispatchLocation, setDispatchLocation] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);
  const queryClient = useQueryClient()

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
      await ApiClient.put(`/attendances/${slug}`, data);
      await queryClient.invalidateQueries(ReactQueryKey.LATEST_PARADE);
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

  const { data, isError } = useQuery(ReactQueryKey.LATEST_PARADE,
    () => {
      if (!slug) return;
      return ApiClient.get(`/parades/${slug}`)
        .then(res => res.data);
    }, { enabled: !!slug }
  );


  if (isError) {
    return <GenericErrorDisplay title="Error">Something went wrong</GenericErrorDisplay>;
  }

  if (data) {
    const handleClickOnName = (attendance: Attendance) => {
      setAttendance(attendance);
      onOpen();
    };

    return (
      <Container maxW="container.xl" minH="100vh" bg={bgColor}>

        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Attendance for {attendance?.user.name}</ModalHeader>
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

        <Stack spacing={4}>
          <Heading>Parade State Summary</Heading>
          <Text>Node: THWHQ</Text>
          <Text>Start Time: {data.startDate}</Text>
          <Text>End Time: {data.endDate}</Text>
          {data.attendances.map((attendance: Attendance) => {
            return (
              <Link key={attendance.id} onClick={() => handleClickOnName(attendance)}>
                <HorizontalCard key={attendance.id}>
                  <CardBody>
                    <Text>{`${attendance.user.rank} ${attendance.user.name}`}</Text>
                    {generateAttendanceStatus(attendance.availability)}
                  </CardBody>
                </HorizontalCard>
              </Link>
            );
          })
          }
        </Stack>
      </Container>
    );
  }

  return (
    <Container p={4} maxW="container.xl" minH="100vh" bg={bgColor}>
      <Stack p={4} spacing="12px">
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </Container>
  );
}
