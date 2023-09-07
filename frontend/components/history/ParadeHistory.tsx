import { CardBody, Heading, Link, Skeleton, Stack } from '@chakra-ui/react';
import HorizontalCard from '@/components/HorizontalCard';
import NextLink from 'next/link';
import { ApiClient } from '@/utils/axios';
import { ReactQueryKey } from '@/utils/react-query-keys';
import { useQuery } from 'react-query';
import { ParadeListItem } from '@/utils/types/ParadeListItem';
import { DateTime } from 'luxon';

export default function ParadeHistory() {
  const { data, isLoading } = useQuery<ParadeListItem[]>(ReactQueryKey.ALL_PARADES,
    () => {
      return ApiClient.get('/parades').then(res => res.data);
    },
  );

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height='20px' />
        <Skeleton height='20px' />
        <Skeleton height='20px' />
      </Stack>
    );
  }

  return (
    <>
      {data.map(parade => {
        return (
          <Link href={`/parade/${parade.id}`} as={NextLink} key={parade.id}>
            <HorizontalCard>
              <CardBody>
                <Heading size='md'>{DateTime.fromISO(parade.startDate).toLocaleString(DateTime.DATE_HUGE)}</Heading>
              </CardBody>
            </HorizontalCard>
          </Link>
        );
      })}
    </>
  );
}
