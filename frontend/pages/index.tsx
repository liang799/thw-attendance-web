import {
  Button,
  Box,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useForm } from "react-hook-form";
import { ApiClient } from "@/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAccessToken, setAccessToken, setUserId } from '@/utils/auth';
import PasswordInput from "@/components/PasswordInput";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { isGuestMode, startGuestSession } from '@/utils/guest/session';

const schema = yup.object({
  userName: yup.string().required(),
  password: yup.string().required()
});

type LoginData = {
  userName: string,
  password: string
}

export default function LoginPage() {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const router = useRouter();
  const enterGuestMode = () => {
    try {
      startGuestSession();
      window.location.assign('/parade');
    } catch {
      toast({ status: 'error', title: 'Unable to start demo', description: 'Allow browser session storage and try again.' });
    }
  };
  const onSubmit = async (data: LoginData) => {
    try {
      const response = await ApiClient.post("/auth/login", data);
      setAccessToken(response.data?.access_token);
      setUserId(response.data?.id);
      router.push("/parade");
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

  useEffect(() => {
    if (isGuestMode()) {
      router.push('/parade');
      return;
    }
    try {
      getAccessToken();
      console.info('Redirect user as he is logged in');
      router.push('/parade');
    } catch (e) {
      console.info('User is not logged in. Do not redirect');
    }
  }, [router]);


  return (
    <Container maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Flex px={{ base: 2, md: 5 }} py={{ base: 10, md: 16 }} align="center" justify="center" flexDirection="column">
        <Text fontWeight="bold" color={useColorModeValue('teal.700', 'teal.200')} mb={3}>THW · ATTENDANCE</Text>
        <Heading textAlign="center" size="xl">Parade State Tracker</Heading>
        <Text textAlign="center" mt={3} mb={8}>Keep your team’s daily attendance in one place.</Text>
        <Stack w="full" maxW="420px" bg={useColorModeValue("white", "gray.700")} p={{ base: 5, md: 7 }} borderRadius="xl" borderWidth="1px" spacing={5}>
          <Heading size="md">Sign in to your account</Heading>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.userName}>
              <FormLabel htmlFor="userName">Username</FormLabel>
              <Input id="userName" autoComplete="username" {...register("userName")} />
              <FormErrorMessage>{errors.userName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <PasswordInput id="password" autoComplete="current-password" {...register("password")} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button mt={5} w="full" colorScheme="teal" isLoading={isSubmitting} type="submit">
              Sign in
            </Button>
          </form>
          <Box borderTopWidth="1px" pt={5}>
            <Text fontWeight="semibold" mb={1}>Just looking around?</Text>
            <Text fontSize="sm" mb={4}>Explore attendance, bulk editing, and parade history with sample data. No account needed.</Text>
            <Button w="full" variant="outline" colorScheme="teal" onClick={enterGuestMode}>Explore as guest</Button>
          </Box>
        </Stack>
        <Link mt={5} href='https://thw-excel-generator.vercel.app/' isExternal>
          Related - Telegram Parade States to Excel <ExternalLinkIcon mx='2px' />
        </Link>
      </Flex>
    </Container>
  );
}
