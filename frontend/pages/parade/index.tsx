import HorizontalCard from '@/components/HorizontalCard';
import { CardBody, Container, Heading, Link, Skeleton, Stack, useColorModeValue } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { ReactQueryKey } from '@/utils/react-query-keys';
import { ApiClient } from '@/utils/axios';
import Navbar from '@/components/Navbar';
import NextLink from 'next/link';

export default function ParadeIndexPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const { data, isLoading, isError } = useQuery(ReactQueryKey.LATEST_PARADE,
    () => {
      return ApiClient.get('/ongoing-parade')
        .then(res => res.data);
    }, { retry: false },
  );

  if (isLoading) {
    return (
      <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
        <Navbar />
        <Stack p={4} spacing='12px'>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
        <Navbar />
        <Stack p={4} spacing='12px'>
          <Heading pb={4}>Parade State Tracker</Heading>
          <Link href='/parade/create' as={NextLink}>
            <HorizontalCard>
              <CardBody>
                <Heading size='md'>Create Parade</Heading>
              </CardBody>
            </HorizontalCard>
          </Link>
        </Stack>
      </Container>
    );
  }

  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />

      <Stack p={4} spacing='12px'>
        <Heading pb={4}>Parade State Tracker</Heading>

        <Link href='/submit-attendance' as={NextLink}>
          <HorizontalCard>
            <CardBody>
              <Heading size='md'>Submit Attendance</Heading>
            </CardBody>
          </HorizontalCard>
        </Link>

        <Link href={`/parade/${data.id}`} as={NextLink}>
          <HorizontalCard>
            <CardBody>
              <Heading size='md'>Overview</Heading>
            </CardBody>
          </HorizontalCard>
        </Link>

      </Stack>
    </Container>
  );
}
