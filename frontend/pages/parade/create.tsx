import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { ApiClient } from '@/utils/axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Navbar from '@/components/Navbar';
import { useAuthentication } from '@/utils/auth';

const schema = yup.object({
  startDate: yup.date().required(),
});

type CreateParadeData = {
  startDate: Date,
}

export default function CreateParadePage() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxColor = useColorModeValue('white', 'gray.700');
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  useAuthentication();

  const onSubmit = async (data: CreateParadeData) => {
    try {
      await ApiClient.post('/parades', data);
      toast({
        title: 'Successful',
        description: 'Created new Parade!',
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

  return (
    <Container maxW='container.xl' minH='100vh' bg={bgColor}>
      <Stack py={5}>
        <Navbar />
        <Flex p={5} align='center' justify='center' flexDirection='column'>
          <Heading p={5}>New Parade</Heading>
          <Stack w={[350, 400]} bg={boxColor} p={5}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.startDate}>
                <FormLabel htmlFor='date'>Start Date & Time</FormLabel>
                <Input
                  placeholder='Select Date'
                  size='md'
                  type='date'
                  {...register('startDate')}
                />
                <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
              </FormControl>
              <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
                Submit
              </Button>
            </form>
          </Stack>
        </Flex>
      </Stack>
    </Container>
  );
}
