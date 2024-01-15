import {
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Switch,
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
  useMediaQuery,
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
import { AddIcon, CopyIcon, InfoIcon, LockIcon, TimeIcon } from '@chakra-ui/icons';
import generateParadeText from '@/utils/generateParadeText';
import { useAuthentication } from '@/utils/auth';
import { ParadeData } from '@/utils/types/ParadeData';
import StopParadeButton from '@/components/attendance/StopParadeButton';
import AttendanceCard from '@/components/attendance/AttendanceCard';
import { SearchBar } from '@/components/SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/lib/store';
import { disableSelection, enableSelection, enterAttendanceCreation, enterSingleEdit, exitAttendanceCreation, exitBulkEditing, exitSingleEdit, select, setTabIndex } from '@/lib/features/editing-attendance/attendance.slice';
import BulkEditCommands from '@/components/attendance/BulkEditCommands';
import CreateAttendaceModal from '@/components/attendance/CreateAttendanceModal';
import BulkEditingModalv2 from '@/components/attendance/BulkEditingModal';


export default function ParadeIdPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [isMdScreenAndLarger] = useMediaQuery('(min-width: 800px)');
  const [searchText, setSearchText] = useState<string>('');
  const router = useRouter();
  const { slug } = router.query;
  const { onCopy, hasCopied, setValue: setClipboardText } = useClipboard('');
  const toast = useToast();

  const uiState = useSelector((state: AppState) => state.attendanceSlice);
  const dispatch = useDispatch();
  const isEditing = uiState.status === "editing";
  const isBulkEditing = uiState.status === "selecting";
  const showBulkEditingModal = uiState.editSelected === true;
  const isIdle = uiState.status === "idle";
  const isCreating = uiState.status === "creating";

  useAuthentication();

  const { data: paradeData, isError, isLoading } = useQuery<ParadeData>(`Get Parade ${slug}`,
    () => {
      return ApiClient.get(`/parades/${slug}`)
        .then(res => res.data);
    }, {
    onSuccess: data => {
      setClipboardText(generateParadeText(data));
    },
    enabled: !!slug,
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

  const copyToClipboard = (data: ParadeData) => {
    if (!data) {
      toast({
        title: 'Error',
        description: 'Unable to copy parade state. Please try again',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    setClipboardText(generateParadeText(data));
    onCopy();
    toast({
      title: 'Copied!',
      description: `You have copied Parade State ${data.id} to clipboard`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  if (isLoading || !paradeData || !slug) {
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
    return paradeData.attendances
      .filter((attendance) => attendance.user.type === type)
      .filter((attendance) =>
        searchText.length > 0
          ? attendance.user.name.toLowerCase().includes(searchText)
          : true,
      )
      .map((attendance: Attendance) => (
        <AttendanceCard
          key={attendance.id}
          attendance={attendance}
        />
      ));
  };


  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />

      {isEditing &&
        <AttendanceModal
          attendance={uiState.currentlyEditing}
          handleClose={() => dispatch(exitSingleEdit())}
        />
      }

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
            <TagLabel>{DateTime.fromISO(paradeData.startDate).toFormat('dd MMM yyyy')}</TagLabel>
          </Tag>
          {paradeData.endDate &&
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
            onClick={() => copyToClipboard(paradeData)}
            width='200px'
          >
            {hasCopied ? 'Copied!' : 'Copy'}
          </Button>
          <StopParadeButton paradeId={paradeData.id} />
        </HStack>

        <Divider />

        <Flex mt={4} ml={0}
          style={
            isMdScreenAndLarger ?
              { justifyContent: 'space-between', alignItems: 'center' } :
              { flexDirection: 'column' }
          }>
          <HStack>
            <Heading as='h2' size='md' colorScheme='gray'>Attendance Bulk Editor</Heading>
            <Switch
              isChecked={isBulkEditing}
              onChange={() => {
                if (isBulkEditing) return dispatch(disableSelection());
                dispatch(enableSelection());
              }}
            />
          </HStack>

          {isBulkEditing &&
            <BulkEditCommands
              mt={isMdScreenAndLarger ? 0 : 2}
              colorScheme={uiState.selected.length > 0 ? 'blue' : undefined}
            />
          }
          {showBulkEditingModal &&
            <BulkEditingModalv2 handleClose={() => dispatch(exitBulkEditing())} />
          }
        </Flex>

        <Tabs index={uiState.tabIndex} onChange={(index) => dispatch(setTabIndex(index))}>
          <SearchBar
            py={4}
            placeholder='Search name (no rank) ...'
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
            <Tab>Media Team</Tab>
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
              {renderFilteredAttendances('Media Team')}
            </TabPanel>
            <TabPanel>
              {renderFilteredAttendances('Transition')}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {isIdle &&
          <Button leftIcon={<AddIcon />} onClick={() => dispatch(enterAttendanceCreation())}>
            New Attendance
          </Button>
        }
        {isCreating &&
          <CreateAttendaceModal
            handleClose={() => dispatch(exitAttendanceCreation())}
            existingAttendances={paradeData.attendances}
          />
        }
      </Stack>
    </Container >
  );
}
