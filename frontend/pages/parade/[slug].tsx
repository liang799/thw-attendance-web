import {
  Container, Skeleton, Stack,
  useColorModeValue
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { ReactQueryKey } from "@/utils/react-query-keys";
import { ApiClient } from "@/utils/axios";
import GenericErrorDisplay from "@/components/GenericErrorDisplay";
import { DataTable } from "@/components/DataTable";
import { createColumnHelper } from "@tanstack/table-core";
import { Attendance } from "@/utils/types/AttendanceData";

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
    const columnHelper = createColumnHelper<Attendance>();

    const columns = [
      columnHelper.accessor("id", {
        cell: (info) => info.getValue(),
        header: "Attendance Id"
      }),
      columnHelper.accessor("user", {
        cell: (info) => `${info.getValue().rank} ${info.getValue().name}`,
        header: "User"
      }),
      columnHelper.accessor("availability.status", {
        cell: (info) => info.getValue(),
        header: "Status"
      })
    ];

    return (
      <Container maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
        <DataTable columns={columns} data={data.attendances} />
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
