import { Box, Heading, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';

export default function GuestWelcome() {
  const background = useColorModeValue('white', 'gray.700');
  const accent = useColorModeValue('teal.700', 'teal.200');
  return (
    <Box bg={background} borderWidth="1px" borderRadius="xl" p={{ base: 5, md: 7 }}>
      <Text color={accent} fontSize="sm" fontWeight="bold" mb={2}>WELCOME TO THE DEMO</Text>
      <Heading size="lg" mb={3}>One place to keep everyone accounted for.</Heading>
      <Text mb={6}>You’re exploring as Alex Tan, a fictional team member. Try the daily attendance workflow below.</Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
        {[
          ['01', 'Submit your attendance', 'Choose a status, add details, and see your update in the parade.'],
          ['02', 'Manage the parade', 'Browse branches, edit a person, or select several people to update together.'],
          ['03', 'Review and share', 'Open a past parade or copy a formatted summary to your clipboard.'],
        ].map(([step, title, description]) => (
          <Box key={step}>
            <Text fontSize="sm" color={accent} fontWeight="bold" mb={2}>{step}</Text>
            <Text fontWeight="semibold" mb={1}>{title}</Text>
            <Text fontSize="sm">{description}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
