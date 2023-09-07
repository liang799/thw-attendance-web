import HorizontalCard from '@/components/HorizontalCard';
import { Button, CardBody, Container, Heading, Link, Skeleton, Stack, useColorModeValue } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { ReactQueryKey } from '@/utils/react-query-keys';
import { ApiClient } from '@/utils/axios';
import Navbar from '@/components/Navbar';
import NextLink from 'next/link';
import { useAuthentication } from '@/utils/auth';
import { useRouter } from 'next/router';
import { AddIcon } from '@chakra-ui/icons';
import ParadeHistory from '@/components/history/ParadeHistory';

export default function ParadeIndexPage() {
  useAuthentication();

  const router = useRouter();
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

          <Button
            leftIcon={<AddIcon />}
            colorScheme='teal'
            onClick={() => router.push('/parade/create')}
            maxW={150}
          >
            New Parade
          </Button>

          <ParadeHistory/>

        </Stack>
      </Container>
    );
  }

  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />

      <Stack p={4} spacing='12px'>
        <Heading py={4}>Parade State Tracker</Heading>

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
