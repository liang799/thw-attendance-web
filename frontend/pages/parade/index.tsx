import HorizontalCard from "@/components/HorizontalCard";
import {
  CardBody,
  Container,
  Heading,
  Link,
  Stack,
  useColorModeValue
} from "@chakra-ui/react";

export default function ParadeIndexPage() {
  return (
    <Container p={4} maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack p={4} spacing="12px">
        <Heading pb={4}>Parade State Tracker</Heading>
        <Link href="/submit-attendance">
          <HorizontalCard>
            <CardBody>
              <Heading size="md">Submit Attendance</Heading>
            </CardBody>
          </HorizontalCard>
        </Link>

        <Link href="/parade/:id">
          <HorizontalCard>
            <CardBody>
              <Heading size="md">Overview</Heading>
            </CardBody>
          </HorizontalCard>
        </Link>
      </Stack>
    </Container>
  );
}
