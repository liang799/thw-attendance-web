import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ApiClient } from "@/utils/axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Navbar from "@/components/Navbar";

const schema = yup.object({
    type: yup.string().required(),
    startDate: yup.date().required()
});

type RegisterData = {
    type: string,
    startDate: Date,
}

export default function CreateParadePage() {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const boxColor = useColorModeValue("white", "gray.700");
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data: RegisterData) => {
    try {
      const response = await ApiClient.post("/parades", data);
      toast({
        title: "Successful",
        description: "Created new Parade!",
        status: "success",
        duration: 5000,
        isClosable: true
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

  return (
    <Container maxW="container.xl" minH="100vh" bg={bgColor}>
      <Navbar />
      <Flex p={5} align="center" justify="center" flexDirection="column">
        <Heading p={5}>New Parade</Heading>
        <Stack bg={boxColor} p={5}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.type}>
              <FormLabel htmlFor="parade">Parade</FormLabel>
              <Select {...register("type")}>
                <option value="First Parade">First Parade</option>
                <option value="Mid Parade">Mid Parade</option>
              </Select>
              <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.startDate}>
              <FormLabel htmlFor="date">Start Date & Time</FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                {...register("startDate")}
              />
              <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
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
