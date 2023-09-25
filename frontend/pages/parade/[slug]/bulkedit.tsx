import { Checkbox, Heading } from '@chakra-ui/react';
import { ParadeData } from '@/utils/types/ParadeData';
import { ApiClient } from '@/utils/axios';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Attendance } from '@/utils/types/AttendanceData';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable';

export default function BulkEdit() {
  const router = useRouter();
  const { slug } = router.query;

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
    columnHelper.accessor(row => `${row.user.rank} ${row.user.name}`, {
      header: 'User',
    }),
  ];
  return (
    <DataTable data={paradeData.attendances} columns={columns} />
  );
}
