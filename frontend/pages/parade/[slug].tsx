import {
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  TagLeftIcon,
  useClipboard,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { ApiClient } from '@/utils/axios';
import GenericErrorDisplay from '@/components/GenericErrorDisplay';
import { Attendance } from '@/utils/types/AttendanceData';
import { useState } from 'react';
import { DateTime } from 'luxon';
import AttendanceModal from '@/components/attendance/AttendanceModal';
import Navbar from '@/components/Navbar';
import { CopyIcon, InfoIcon, LockIcon, TimeIcon } from '@chakra-ui/icons';
import generateParadeText from '@/utils/generateParadeText';
import { useAuthentication } from '@/utils/auth';
import { ParadeData } from '@/utils/types/ParadeData';
import StopParadeButton from '@/components/attendance/StopParadeButton';
import AttendanceCard from '@/components/attendance/AttendanceCard';
import { SearchBar } from '@/components/SearchBar';


export default function ParadeIdPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [searchText, setSearchText] = useState<string>('');
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

  const renderFilteredAttendances = (type: string) => {
    return data.attendances
      .filter((attendance) => attendance.user.type === type)
      .filter((attendance) =>
        searchText.length > 0
          ? attendance.user.name.toLowerCase().includes(searchText)
          : true
      )
      .map((attendance: Attendance) => (
        <AttendanceCard key={attendance.id} attendance={attendance} handleClick={handleClick} />
      ));
  };


  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />

      <AttendanceModal
        attendanceId={attendance?.id}
        person={attendance?.user.name}
        showModal={showModal}
        setShowModal={setShowModal}
      />

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
          {data.endDate &&
            <Tag
              size='md'
              colorScheme='red'
            >
              <TagLeftIcon boxSize='12px' as={LockIcon} />
              <TagLabel>Parade Stopped</TagLabel>
            </Tag>
          }
        </HStack>
        <HStack spacing={4}>
          <Button
            colorScheme='teal'
            leftIcon={<CopyIcon />}
            onClick={() => copyToClipboard(data)}
            width='200px'
          >
            {hasCopied ? 'Copied!' : 'Copy'}
          </Button>
          <StopParadeButton paradeId={data.id} />
        </HStack>

        <Divider />

        <Heading mt={4} as='h2' size='md' colorScheme='gray'>Attendances</Heading>
        <Tabs>
          <SearchBar
            py={4}
            placeholder='Search name...'
            onChange={(event) => setSearchText(event.target.value.toLowerCase())}
          />

          <TabList
            overflowY='hidden'
            sx={{
              scrollbarWidth: 'none',
              '::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Tab>Commanders</Tab>
            <Tab>S1 Branch</Tab>
            <Tab>S3 Branch</Tab>
            <Tab>S4 Branch</Tab>
            <Tab>Transition</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              {renderFilteredAttendances('Commander')}
            </TabPanel>
            <TabPanel>
              {renderFilteredAttendances('S1 Branch')}
            </TabPanel>
            <TabPanel>
              {renderFilteredAttendances('S3 Branch')}
            </TabPanel>
            <TabPanel>
              {renderFilteredAttendances('S4 Branch')}
            </TabPanel>
            <TabPanel>
              {renderFilteredAttendances('Transition')}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}
