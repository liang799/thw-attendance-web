import {
  Button,
  Checkbox,
  Container,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { ParadeData } from '@/utils/types/ParadeData';
import { ApiClient } from '@/utils/axios';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import { Attendance, CreateAttendanceData } from '@/utils/types/AttendanceData';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import { ArrowForwardIcon, CheckCircleIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import { useEffect, useState } from 'react';
import { attendanceOptions } from '@/config/attendanceOptions';

export default function BulkEdit() {
  const router = useRouter();
  const { slug } = router.query;
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [rowSelection, setRowSelection] = useState({})
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    console.log(rowSelection)
  }, [rowSelection])

  const { data: paradeData, isError, isLoading } = useQuery<ParadeData>(`Get Parade ${slug}`,
    () => {
      return ApiClient.get(`/parades/${slug}`)
        .then(res => res.data);
    }, {
      enabled: !!slug,
    },
  );

  if (isError) return <Heading>Error</Heading>;
  if (isLoading || !slug || !paradeData) return <Heading>Loading</Heading>;

  const columns: ColumnDef<Attendance>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          {...{
            isChecked: table.getIsAllRowsSelected(),
            isIndeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row, getValue }) => (
        <Checkbox
          {...{
            isChecked: row.getIsSelected(),
            isIndeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
      footer: props => props.column.id,
    },
    {
      header: 'User',
      id: 'user',
      accessorFn: row => `${row.user.rank} ${row.user.name}`,
    },
    {
      header: 'Status',
      id: 'status',
      accessorFn: row => row.availability.status,
    },
    {
      header: 'Remarks',
      id: 'remarks',
      accessorFn: row => row.availability.absentEndDate || row.availability.dispatchLocation,
    },
  ];

  async function markSelectedAsPresent(paradeData: ParadeData) {
    const selectedStringIndexes = Object.keys(rowSelection);
    const updatedList = selectedStringIndexes.map((stringIndex) => {
      const index = parseInt(stringIndex);
      const attendance = paradeData.attendances[index];
      const present = attendanceOptions.find(option => option.status === 'Present');
      if (!present) throw new Error('Please fix attendance config file!');
      const data: CreateAttendanceData = {
        id: attendance.id,
        user: attendance.user.id,
        availability: present.availability,
        status: present.status,
      };
      return data;
    });
    try {
      await ApiClient.put(`/attendances`, updatedList);
      await queryClient.invalidateQueries();
      toast({
        title: "Successful",
        description: "Updated Attendances",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  }

  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />
      <Stack>
        <Heading pt={4} px={4}>Bulk Edit</Heading>
        <HStack px={4} pb={2}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              With Selected
            </MenuButton>
            <MenuList>
              <MenuItem icon={<CheckCircleIcon />} onClick={() => markSelectedAsPresent(paradeData)}>
                Mark Present
              </MenuItem>
              <MenuItem icon={<EditIcon />}>Set as...</MenuItem>
              <MenuItem icon={<ArrowForwardIcon />}>Move to branch...</MenuItem>
              <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
            </MenuList>
          </Menu>
          <Button colorScheme='green'>Save</Button>
        </HStack>
        <DataTable
          data={paradeData.attendances}
          columns={columns}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        <ScrollToTop />
      </Stack>
    </Container>
  );
}
