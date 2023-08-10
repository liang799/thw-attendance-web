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
import { PasswordInput } from "@/components/PasswordInput";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

export default function RegisterPage() {
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = async (data) => {
    try {
      const response = await ApiClient.post("/users", data);
    } catch (error: Error) {
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
        <Heading p={5}>Registration</Heading>
        <Stack bg={useColorModeValue("white", "gray.700")} p={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input {...register("email")} />
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
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
