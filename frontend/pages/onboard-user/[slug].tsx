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
import { useRouter } from "next/router";

const schema = yup.object({
  rank: yup.string().uppercase().required(),
  name: yup.string().lowercase().required()
});

export default function UserIdPage() {
  const toast = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });
  const onSubmit = async (data) => {
    try {
      const response = await ApiClient.patch(`/users/${router.query.slug}`, data);
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
        <Heading size="lg" p={5}>Hi! Help us to get to know you better</Heading>
        <Stack bg={useColorModeValue("white", "gray.700")} p={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.rank}>
              <FormLabel htmlFor="rank">Rank</FormLabel>
              <Input {...register("rank")} />
              <FormErrorMessage>{errors.rank?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.name}>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input {...register("name")} />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
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
