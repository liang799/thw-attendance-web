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
} from '@chakra-ui/react';
import { ParadeData } from '@/utils/types/ParadeData';
import { ApiClient } from '@/utils/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Attendance } from '@/utils/types/AttendanceData';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';
import { ArrowForwardIcon, CheckCircleIcon, ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';

export default function BulkEdit() {
  const router = useRouter();
  const { slug } = router.query;
  const bgColor = useColorModeValue('gray.50', 'gray.800');

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

  const columnHelper = createColumnHelper<Attendance>();
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
              <MenuItem
                icon={<CheckCircleIcon />}
              >
                Mark Present
              </MenuItem>
              <MenuItem icon={<EditIcon />}>Set as...</MenuItem>
              <MenuItem icon={<ArrowForwardIcon />}>Move to branch...</MenuItem>
              <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
            </MenuList>
          </Menu>
          <Button colorScheme='green'>Save</Button>
        </HStack>
        <DataTable data={paradeData.attendances} columns={columns} />
        <ScrollToTop />
      </Stack>
    </Container>
  );
}
