import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import { CheckCircleIcon, ChevronDownIcon, CopyIcon, EditIcon, InfoIcon, LockIcon, TimeIcon } from '@chakra-ui/icons';
import generateParadeText from '@/utils/generateParadeText';
import { useAuthentication } from '@/utils/auth';
import { ParadeData } from '@/utils/types/ParadeData';
import StopParadeButton from '@/components/attendance/StopParadeButton';
import AttendanceCard from '@/components/attendance/AttendanceCard';
import { SearchBar } from '@/components/SearchBar';
import CustomSwitch from '@/components/CustomSwitch';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@/lib/store';
import { clickCard, select } from '@/lib/features/editing-attendance/attendance.slice';



enum PageStatus { // Todo migrate all these to redux
  IDLE,         // Default
  BULK_EDITING, // TODO
  EDITING       // Migrated to Redux
}

export default function ParadeIdPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const [isMdScreenAndLarger] = useMediaQuery('(min-width: 800px)');
  const [searchText, setSearchText] = useState<string>('');
  const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.IDLE);
  const router = useRouter();
  const { slug } = router.query;
  const { onCopy, hasCopied, setValue: setClipboardText } = useClipboard('');
  const toast = useToast();

  const uiState = useSelector((state: AppState) => state.attendanceSlice);
  const dispatch = useDispatch();
  const isEditing = uiState.status === "editing";

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

  const handleClick = (attendance: Attendance) => {
    dispatch(clickCard(attendance));
    if (pageStatus !== PageStatus.BULK_EDITING) setPageStatus(PageStatus.EDITING);
  };

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
          isBulkEditing={
            pageStatus === PageStatus.BULK_EDITING
          }
          handleClick={() => handleClick(attendance)}
        />
      ));
  };


  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />

      {isEditing &&
        <AttendanceModal
          attendance={uiState.lastClicked}
          handleClose={() => setPageStatus(PageStatus.IDLE)}
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
            <Heading as='h2' size='md' colorScheme='gray'>Attendances Bulk Edit</Heading>
            <CustomSwitch
              whenEnabled={() => setPageStatus(PageStatus.BULK_EDITING)}
              whenDisabled={() => setPageStatus(PageStatus.IDLE)}
            />
          </HStack>

          {pageStatus === PageStatus.BULK_EDITING && (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} mt={isMdScreenAndLarger ? 0 : 2}>
                With Selected
              </MenuButton>
              <MenuList>
                <MenuItem icon={<CheckCircleIcon />} onClick={() => { }}>
                  Mark Present
                </MenuItem>
                <MenuItem icon={<EditIcon />} onClick={() => { }}>
                  Set as...
                </MenuItem>
                {/*<MenuItem icon={<ArrowForwardIcon />}>Move to branch...</MenuItem>*/}
                {/*<MenuItem icon={<DeleteIcon />}>Delete</MenuItem>*/}
              </MenuList>
            </Menu>
          )}
        </Flex>

        <Tabs>
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
      </Stack>
    </Container >
  );
}
