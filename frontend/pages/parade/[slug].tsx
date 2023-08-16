import {
  CardBody,
  Container, Heading, Button, Link, Skeleton, Stack, useToast,
  Text, useColorModeValue, useClipboard, IconButton
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { ReactQueryKey } from "@/utils/react-query-keys";
import { ApiClient } from "@/utils/axios";
import GenericErrorDisplay from "@/components/GenericErrorDisplay";
import { Attendance, GetAttendanceData } from "@/utils/types/AttendanceData";
import HorizontalCard from "@/components/HorizontalCard";
import { useState } from "react";
import { DateTime } from "luxon";
import AttendanceModal from "@/components/AttendanceModal";
import Navbar from "@/components/Navbar";
import { CopyIcon } from '@chakra-ui/icons';

function generateAttendanceStatus(data: GetAttendanceData) {
  const availability = data.status;
  switch (availability) {
    case "Dispatch":
      return <Text>{`${data.status} - ${data.dispatchLocation}`}</Text>;
    case "Present":
      return <Text>{`${data.status}`}</Text>;
    case "MC":
      if (!data.mcEndDate) return <Text>{`${data.status} - No End date`}</Text>;
      const date = DateTime.fromISO(data.mcEndDate).toFormat("ddLLyy");
      return <Text>{`${data.status} - ${date}`}</Text>;
    default:
      return <Text>{data.status}</Text>;
  }
}

export default function ParadeIdPage() {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const { slug } = router.query;
  const { onCopy, value, hasCopied, setValue } = useClipboard("");
  const toast = useToast();

  const { data, isError } = useQuery(ReactQueryKey.LATEST_PARADE,
    () => {
      if (!slug) return;
      return ApiClient.get(`/parades/${slug}`)
        .then(res => res.data);
    }, { enabled: !!slug }
  );

  if (isError) {
    return (
      <>
        <Navbar />
        <GenericErrorDisplay title="Error">Something went wrong</GenericErrorDisplay>
      </>
    );
  }

  if (data) {
    const handleClick = (attendance: Attendance) => {
      setAttendance(attendance);
      setShowModal(true);
    };

    const generateCopiedContent = () => {
      const copiedText: string = [
        `Parade State Summary`,
        `Node: THWHQ`,
        `Start Time: ${DateTime.fromISO(data.startDate).toLocaleString(DateTime.DATETIME_FULL)}`,
        `End Time: ${DateTime.fromISO(data.endDate).toLocaleString(DateTime.DATETIME_FULL)}`,
        ...data.attendances.map((attendance: Attendance) => {
          console.log(attendance?.id)
          return `${attendance.user.rank} ${attendance.user.name} - ${attendance.availability.status}`;
        }),
      ].join('\n');
      setValue(copiedText);
      console.log(value);
      onCopy();
      toast({
        title: 'Copied!',
        description: `You have copied Parade State ${data.id} to clipboard`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    };

    return (
      <Container maxW="container.xl" minH="100vh" bg={bgColor}>
        <Navbar />

        <AttendanceModal attendance={attendance} showModal={showModal} setShowModal={setShowModal} />

        <Stack spacing={4}>
          <Heading>Parade State Summary</Heading>
          <Button colorScheme='teal' leftIcon={<CopyIcon />} onClick={generateCopiedContent} width="200px">
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
          <Text>Node: THWHQ</Text>
          <Text>Start Time: {DateTime.fromISO(data.startDate).toLocaleString(DateTime.DATETIME_FULL)}</Text>
          <Text>End Time: {DateTime.fromISO(data.endDate).toLocaleString(DateTime.DATETIME_FULL)}</Text>
          {data.attendances.map((attendance: Attendance) => {
            return (
              <Link key={attendance.id} onClick={() => handleClick(attendance)}>
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
      <Navbar />
      <Stack p={4} spacing="12px">
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </Container>
  );
}
