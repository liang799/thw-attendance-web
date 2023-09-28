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
import { CheckCircleIcon, ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import { useEffect, useState } from 'react';
import { attendanceOptions } from '@/config/attendanceOptions';
import BulkEditAttendanceModal from '@/components/bulkedit/AttendanceModal';
import { isObjectEmpty } from '@/utils/isObjectEmtpy';

export default function BulkEdit() {
  const router = useRouter();
  const { slug } = router.query;
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [rowSelection, setRowSelection] = useState({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<CreateAttendanceData>();
  const queryClient = useQueryClient();
  const toast = useToast();

  useEffect(() => {
    if (isObjectEmpty(rowSelection)) return;
    const selectedStringIndexes = Object.keys(rowSelection);
    const updatedList = selectedStringIndexes.map((stringIndex) => {
      console.log(`stringIndex: ${stringIndex}`);
      const index = parseInt(stringIndex);
      if (!data || !paradeData) {
        toast({ description: "something went wrong"})
        return;
      }
      const attendance = paradeData.attendances[index];
      let copy = JSON.parse(JSON.stringify(data));
      copy.id = attendance.id;
      copy.user = attendance.user.id;
      return copy;
    });
    console.log(updatedList);
    ApiClient.put(`/attendances`, updatedList)
      .then(() => queryClient.invalidateQueries())
      .then(() => {
        toast({
          title: 'Successful',
          description: 'Updated Attendances',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(e => {
        toast({
          title: 'Error',
          description: 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }, [data]);

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
    if (isObjectEmpty(rowSelection)) {
      toast({
        title: 'Invalid target(s)',
        description: 'Please select users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
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
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  async function bulkEditAttendance(paradeData: ParadeData) {
    if (isObjectEmpty(rowSelection)) {
      toast({
        title: 'Invalid target(s)',
        description: 'Please select users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setShowModal(true);
  }

  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />
      <Stack>
        <Heading pt={4} px={4}>Bulk Edit</Heading>
        <BulkEditAttendanceModal showModal={showModal} setShowModal={setShowModal} setData={setData} />
        <HStack px={4} pb={2}>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              With Selected
            </MenuButton>
            <MenuList>
              <MenuItem icon={<CheckCircleIcon />} onClick={() => markSelectedAsPresent(paradeData)}>
                Mark Present
              </MenuItem>
              <MenuItem icon={<EditIcon />} onClick={() => bulkEditAttendance(paradeData)}>
                Set as...
              </MenuItem>
              {/*<MenuItem icon={<ArrowForwardIcon />}>Move to branch...</MenuItem>*/}
              {/*<MenuItem icon={<DeleteIcon />}>Delete</MenuItem>*/}
            </MenuList>
          </Menu>
          {/*<Button colorScheme='green'>Save</Button>*/}
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
