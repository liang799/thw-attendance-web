import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Stack,
  useColorModeValue, useToast,
} from '@chakra-ui/react';
import PasswordInput from '@/components/PasswordInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApiClient } from '@/utils/axios';
import * as yup from 'yup';
import Navbar from '@/components/Navbar';
import { useAuthentication } from '@/utils/auth';

const schema = yup.object({
  oldPassword: yup.string().required(),
  futurePassword: yup.string().required(),
});

type ChangePasswordDate = {
  oldPassword: string,
  futurePassword: string
}

export default function ChangePasswordPage() {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  useAuthentication();

  const onSubmit = async (data: ChangePasswordDate) => {
    try {
      await ApiClient.post('/auth/changePassword', data);
      toast({
        title: 'Success',
        description: 'Changed Password!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      if (error.response.status === 401) {
        toast({
          title: 'Error',
          description: 'Unable to update due to wrong old password',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: error.name,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW='container.xl' minH='100vh' bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack p={5}>
        <Navbar />
        <Flex p={5} align='center' justify='center' flexDirection='column'>
          <Heading p={5}>Change Password</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.oldPassword}>
              <FormLabel htmlFor='oldPassword'>Old Password</FormLabel>
              <PasswordInput {...register('oldPassword')} />
              <FormErrorMessage>{errors.oldPassword?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.futurePassword}>
              <FormLabel htmlFor='futurePassword'>New Password</FormLabel>
              <PasswordInput {...register('futurePassword')} />
              <FormErrorMessage>{errors.futurePassword?.message}</FormErrorMessage>
            </FormControl>
            <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
              Submit
            </Button>
          </form>
        </Flex>
      </Stack>
    </Container>
  );

}