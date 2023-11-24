import { Box, Heading, Text, Button, getToken } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { getAccessToken } from "@/utils/auth";

export default function NotFound() {
  const router = useRouter();
  const handleClick = () => {
    try {
      getAccessToken();
      router.push("/parade");
    } catch (e) {
      router.push("/");
    }
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text">
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you&apos;re looking for does not seem to exist
      </Text>

      <Button
        onClick={handleClick}
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid">
        Go to Home
      </Button>
    </Box>
  );
}
