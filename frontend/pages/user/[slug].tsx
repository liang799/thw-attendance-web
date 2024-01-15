import {
  Button,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Select,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import { ApiClient } from '@/utils/axios';
import { useRouter } from 'next/router';
import { useQuery, useQueryClient } from 'react-query';
import GenericErrorDisplay from '@/components/GenericErrorDisplay';
import { useAuthentication } from '@/utils/auth';
import { UserData } from '@/utils/types/UserData';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  userType: yup.string().required(),
  hasLeftNode: yup.boolean().required(),
  rank: yup.string().required(),
  name: yup.string().required(),
});

export type FormData = {
  userType: string,
  hasLeftNode: boolean,
  rank: string,
  name: string,
}

export default function EditUserPage() {
  useAuthentication();

  const router = useRouter();
  const { slug } = router.query;
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: userInfo, isError, isLoading } = useQuery<UserData>(`Get User ${slug}`,
    () => {
      return ApiClient.get(`/users/${slug}`)
        .then(res => res.data);
    }, {
    enabled: !!slug,
  },
  );

  const onSubmit = (data: FormData) => {
    const updateData = { 
      hasLeftNode: data.hasLeftNode, 
      type: data.userType,
      rank: data.rank,
      name: data.name,
    };
    ApiClient.patch(`/users/${slug}`, updateData)
      .then(() => queryClient.invalidateQueries())
      .then(() => {
        toast({
          title: 'Success',
          description: 'Updated Personal Info',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error: any) => {
        toast({
          title: error.name,
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  if (isLoading || !slug || !userInfo) {
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
      <>
        <Navbar />
        <GenericErrorDisplay title='Error'>Something went wrong</GenericErrorDisplay>
      </>
    );
  }

  return (
    <Container p={4} maxW='container.xl' minH='100vh' bg={bgColor}>
      <Navbar />
      <Stack p={5}>
        <Heading pb={4}>User</Heading>
        <Heading size='md'>Edit Info</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TableContainer>
            <Table variant='simple'>
              <Tbody>
                <Tr>
                  <Td>Rank</Td>
                  <Td>
                    <FormControl>
                      <Editable defaultValue={userInfo.rank}>
                        <EditablePreview />
                        <EditableInput id='rank' {...register('rank')} />
                      </Editable>
                      <FormErrorMessage>{errors.rank?.message}</FormErrorMessage>
                    </FormControl>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Name</Td>
                  <Td>
                    <FormControl>
                      <Editable defaultValue={userInfo.name}>
                        <EditablePreview />
                        <EditableInput id='name' {...register('name')} />
                      </Editable>
                      <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                    </FormControl>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Type</Td>
                  <Td>
                    <FormControl isInvalid={!!errors.userType}>
                      <Select id='userType' placeholder='Select option' {...register('userType')} defaultValue={userInfo.type}>
                        <option value='Commander'>Commander</option>
                        <option value='S1 Branch'>S1 Branch</option>
                        <option value='S3 Branch'>S3 Branch</option>
                        <option value='S4 Branch'>S4 Branch</option>
                        <option value='Media Team'>Media</option>
                        <option value='Transition'>Transition</option>
                      </Select>
                      <FormErrorMessage>{errors.userType?.message}</FormErrorMessage>
                    </FormControl>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Left Node?</Td>
                  <Td>
                    <FormControl>
                      <Switch id='hasLeftNode' defaultChecked={userInfo.hasLeftNode} {...register('hasLeftNode')} />
                      <FormErrorMessage>{errors.hasLeftNode?.message}</FormErrorMessage>
                    </FormControl>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
            Submit
          </Button>
        </form>
      </Stack>
    </Container>
  );
}
