import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Select, Text, Stack, Button, ModalFooter, Skeleton, Link, useToast } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UserData } from "@/utils/types/UserData";
import { ApiClient } from "@/utils/axios";
import GenericErrorDisplay from "../GenericErrorDisplay";
import { Attendance, CreateAttendanceData } from "@/utils/types/AttendanceData";

type AttendanceModalProps = {
  handleClose: () => void,
  existingAttendances: Attendance[],
}

export default function CreateAttendaceModal({ handleClose, existingAttendances }: AttendanceModalProps) {
  const finalRef = useRef(null);
  const [userId, setUserId] = useState(0);
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: users, isError, isLoading } = useQuery<UserData[]>('Get users',
    () => {
      return ApiClient.get(`/users`)
        .then(res => res.data);
    },
  );

  const onSubmit = async () => {
    if (userId === 0) {
      toast({ status: "error", title: "Please select a valid user" });
      return;
    }
    const data: CreateAttendanceData = {
      availability: "Expect Arrival",
      status: "Present",
      user: userId,
    };

    try {
      await ApiClient.post('/attendances', data);
      await queryClient.invalidateQueries();
      toast({
        title: 'Successful',
        description: 'Created / Updated Attendance!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error.name,
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  const hasSubmittedAttendance = (userId: number) => {
    return existingAttendances.some((attendance) => attendance.user.id === userId);
  };
  const filteredUsers = users
    ?.filter(user => !user.hasLeftNode)
    .filter(user => !hasSubmittedAttendance(user.id))

  return (
    <Modal finalFocusRef={finalRef} isOpen={true} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new Attendance</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {isError &&
            <GenericErrorDisplay title="Error">Something went wrong</GenericErrorDisplay>
          }
          <Skeleton isLoaded={!isLoading}>
            {(filteredUsers && filteredUsers.length > 0) ?
              <Stack>
                <FormControl>
                  <FormLabel>Select user:</FormLabel>
                  <Select placeholder="=== Select user ===" onChange={(event) => setUserId(+event.target.value)} >
                    {filteredUsers
                      .map((data, index) => (
                        <option key={index} value={data.id}>{data.name}</option>
                      ))}
                  </Select>
                </FormControl>
                <Button colorScheme='teal' onClick={onSubmit}>
                  Create Attendance
                </Button>
              </Stack>
              :
              <Text>No missing user attendance</Text>
            }

          </Skeleton>
        </ModalBody>

        <ModalFooter>
          <Text>
            User not found? {" "}
            <Link as={NextLink} color='teal.500' href='/user/create'>
              Click Here to create user <ExternalLinkIcon mx='2px' />
            </Link>
          </Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}