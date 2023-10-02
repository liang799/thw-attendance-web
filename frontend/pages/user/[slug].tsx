import {
  Button,
  Container,
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
  hasLeftNode: yup.boolean(),
});

export type FormData = {
  userType: string,
  hasLeftNode: boolean,
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

  const onSubmit = async (data: FormData) => {
    try {
      const updateData = { hasLeftNode: data.hasLeftNode, type: data.userType };
      await ApiClient.patch(`/users/${slug}`, updateData);
      await queryClient.invalidateQueries();
      toast({
        title: 'Success',
        description: 'Updated Personal Info',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error.name,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
    <Container p={4} maxW='container.xl' minH='100vh' bg={useColorModeValue('gray.50', 'gray.800')}>
      <Navbar />
      <Stack p={5}>
        <Heading pb={4}>Personal Info</Heading>
        <Heading size='md'>Basic Info</Heading>
        <TableContainer>
          <Table variant='simple'>
            <Tbody>
              <Tr>
                <Td>Rank</Td>
                <Td>{userInfo.rank}</Td>
              </Tr>
              <Tr>
                <Td>Name</Td>
                <Td>{userInfo.name}</Td>
              </Tr>
              <Tr>
                <Td>Type</Td>
                <Td>{userInfo.type}</Td>
              </Tr>
              <Tr>
                <Td>Left Node?</Td>
                <Td>{userInfo.hasLeftNode ? 'Yes' : 'No'}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Heading size='md' pt={2}>Edit Info</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isInvalid={!!errors.userType}>
            <FormLabel htmlFor='userType'>User Type</FormLabel>
            <Select id='userType' placeholder='Select option' {...register('userType')}>
              <option value='Commander'>Commander</option>
              <option value='S1 Branch'>S1 Branch</option>
              <option value='S3 Branch'>S3 Branch</option>
              <option value='S4 Branch'>S4 Branch</option>
              <option value='Media Team'>Media</option>
              <option value='Transition'>Transition</option>
            </Select>
            <FormErrorMessage>{errors.userType?.message}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='hasLeftNode'>Left Node?</FormLabel>
            <Switch id='hasLeftNode' {...register('hasLeftNode')} />
            <FormErrorMessage>{errors.hasLeftNode?.message}</FormErrorMessage>
          </FormControl>
          <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
            Submit
          </Button>
        </form>
      </Stack>
    </Container>
  );
}
