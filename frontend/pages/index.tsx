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
  useToast
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ApiClient } from "@/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { setAccessToken, setUserId } from "@/utils/AuthService";
import PasswordInput from "@/components/PasswordInput";
import { useRouter } from "next/navigation";

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

  return (
    <Container maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Flex p={5} align="center" justify="center" flexDirection="column">
        <Heading p={5}>Login</Heading>
        <Stack bg={useColorModeValue("white", "gray.700")} p={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.userName}>
              <FormLabel htmlFor="userName">Username</FormLabel>
              <Input {...register("userName")} />
              <FormErrorMessage>{errors.userName?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <PasswordInput {...register("password")} />
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
              Submit
            </Button>
          </form>
        </Stack>
      </Flex>
    </Container>
  );
}
