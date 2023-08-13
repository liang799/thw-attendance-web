import {
  CardBody,
  Container, Heading, Link, Skeleton, Stack, Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { ReactQueryKey } from "@/utils/react-query-keys";
import { ApiClient } from "@/utils/axios";
import GenericErrorDisplay from "@/components/GenericErrorDisplay";
import { Attendance, AttendanceData } from "@/utils/types/AttendanceData";
import HorizontalCard from "@/components/HorizontalCard";

function generateAttendanceStatus(data: AttendanceData) {
  const availability = data.availability;
  switch (availability) {
    case "Dispatch":
      return <Text>{`${data.status} - ${data.location}`}</Text>;
    case "No MC":
      return <Text>{`${data.status}`}</Text>;
    case "Might Have MC":
      return <Text>{`${data.status}`}</Text>;
    case "Absent":
      return <Text>{`${data.status} - ${data.mcEndDate}`}</Text>;
    default:
      return <Text>{data.status}</Text>;
  }

}

export default function ParadeIdPage() {
  const router = useRouter();
  const { slug } = router.query;

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
    return (
      <Container maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
        <Stack spacing={4}>
          <Heading>Parade State Summary</Heading>
          <Text>Node: THWHQ</Text>
          <Text>Start Time: {data.startDate}</Text>
          <Text>End Time: {data.endDate}</Text>
          {data.attendances.map((attendance: Attendance) => {
            return (
              <Link key={attendance.id} href={`/attendances/${attendance.id}`}>
                <HorizontalCard>
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
    <Container p={4} maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack p={4} spacing="12px">
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </Container>
  );
}
