import {
  CardBody,
  Container, Heading, Button, Link, Skeleton, Stack, useToast,
  Text, useColorModeValue, useClipboard, HStack, Tag, TagLabel, TagLeftIcon, Avatar, Flex, Box, Badge,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { ApiClient } from '@/utils/axios';
import GenericErrorDisplay from '@/components/GenericErrorDisplay';
import { Attendance, GetAttendanceData } from '@/utils/types/AttendanceData';
import HorizontalCard from '@/components/HorizontalCard';
import { useState } from 'react';
import { DateTime } from 'luxon';
import AttendanceModal from '@/components/AttendanceModal';
import Navbar from '@/components/Navbar';
import { CopyIcon, InfoIcon, TimeIcon } from '@chakra-ui/icons';
import generateParadeText from '@/utils/generateParadeText';
import { useAuthentication } from '@/utils/auth';
import { convertCapsWithSpacingToCamelCaseWithSpacing } from '@/utils/text';
import { ParadeData } from '@/utils/types/ParadeData';

function generateAttendanceStatus(data: GetAttendanceData) {
  const availability = data.status;
  switch (availability) {
    case 'Dispatch':
      return <Text>{`${data.status} - ${data.dispatchLocation}`}</Text>;
    case 'Present':
      return <Text>{`${data.status}`}</Text>;
    case 'MC':
      if (!data.mcEndDate) return <Text>{`${data.status} - No End date`}</Text>;
      const date = DateTime.fromISO(data.mcEndDate).toFormat('ddLLyy');
      return <Text>{`${data.status} - ${date}`}</Text>;
    default:
      return <Text>{data.status}</Text>;
  }
}

export default function ParadeIdPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();
  const { slug } = router.query;
  const { onCopy, value, hasCopied, setValue } = useClipboard('');
  const toast = useToast();

  useAuthentication();

  const { data, isError, isLoading } = useQuery<ParadeData>(`Get Parade ${slug}`,
    () => {
      return ApiClient.get(`/parades/${slug}`)
        .then(res => res.data);
    }, {
      onSuccess: data => {
        setValue(generateParadeText(data));
      },
    },
  );

  if (isError) {
    return (
      <>
        <Navbar />
        <GenericErrorDisplay title='Error'>Something went wrong</GenericErrorDisplay>
      </>
    );
  }

  const handleClick = (attendance: Attendance) => {
    setAttendance(attendance);
    setShowModal(true);
  };

  const copyToClipboard = (data: ParadeData) => {
    if (!value) {
      toast({
        title: 'Error',
        description: 'Unable to copy parade state. Please try again',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    onCopy();
    toast({
      title: 'Copied!',
      description: `You have copied Parade State ${data.id} to clipboard`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  if (isLoading || !data || !slug) {
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

  const determineAttendanceColor = (data: Attendance) => {
    if (data.availability.type === "Present")
      return "green"
    if (data.availability.type === "Absent")
      return "red"
    return "yellow"
  }

  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />

      <AttendanceModal attendance={attendance} showModal={showModal} setShowModal={setShowModal} />

      <Stack p={4} spacing={4}>
        <Heading pt={4}>Parade State Summary</Heading>
        <HStack spacing={4}>
          <Tag
            size='md'
            variant='outline'
            colorScheme='green'
          >
            <TagLeftIcon boxSize='12px' as={InfoIcon} />
            <TagLabel>THWHQ</TagLabel>
          </Tag>
          <Tag
            size='md'
            variant='outline'
            colorScheme='green'
          >
            <TagLeftIcon boxSize='12px' as={TimeIcon} />
            <TagLabel>{DateTime.fromISO(data.startDate).toFormat('dd MMM yyyy')}</TagLabel>
          </Tag>
        </HStack>
        <Button
          colorScheme='teal'
          leftIcon={<CopyIcon />}
          onClick={() => copyToClipboard(data)}
          width='200px'
        >
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
        {data.attendances.map((attendance: Attendance) => {
          return (
            <Link key={attendance.id} onClick={() => handleClick(attendance)}>
              <HorizontalCard key={attendance.id}>
                <CardBody>
              <Flex>
                <Avatar />
                <Box ml='3'>
                  <Text fontWeight='bold'>
                    {`${attendance.user.rank} ${convertCapsWithSpacingToCamelCaseWithSpacing(attendance.user.name)}`}
                    <Badge ml='2' mb='1' colorScheme={determineAttendanceColor(attendance)}>
                      {generateAttendanceStatus(attendance.availability)}
                    </Badge>
                  </Text>
                  <Text fontSize='sm'>{attendance.user.type}</Text>
                </Box>
              </Flex>
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
