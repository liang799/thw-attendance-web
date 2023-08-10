import HorizontalCard from "@/components/HorizontalCard";
import {
  Button,
  CardBody,
  CardFooter,
  Container,
  Heading,
  Stack,
  Table, TableCaption, TableContainer, Tbody,
  Td,
  Text, Tfoot, Th, Thead, Tr,
  useColorModeValue
} from "@chakra-ui/react";

export default function ParadeIndexPage() {
  return (
    <Container p={4} maxW="container.xl" minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Stack p={4}>
        <Heading pb={4}>Ongoing Parade</Heading>
        <HorizontalCard
          imageSrc="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          imageAlt="Sofa">
          <CardBody>
            <Heading size="md">Mid Parade</Heading>

            <Text py="2">
              Caffè latte is a coffee beverage of Italian origin made with espresso
              and steamed milk.
            </Text>
          </CardBody>

          <CardFooter>
            <Button variant="solid" colorScheme="blue">
              Buy Latte
            </Button>
          </CardFooter>
        </HorizontalCard>
      </Stack>
      <Stack p={4}>
        <Heading pb={4}>History</Heading>
        <TableContainer>
          <Table variant='simple'>
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
              </Tr>
              <Tr>
                <Td>feet</Td>
                <Td>centimetres (cm)</Td>
                <Td isNumeric>30.48</Td>
              </Tr>
              <Tr>
                <Td>yards</Td>
                <Td>metres (m)</Td>
                <Td isNumeric>0.91444</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
}
