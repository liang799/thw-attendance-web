import { Badge, Box, Button, Flex, HStack, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { endGuestSession, isGuestMode, startGuestSession } from '@/utils/guest/session';

export default function GuestBanner() {
  const background = useColorModeValue('teal.50', 'teal.900');
  const border = useColorModeValue('teal.200', 'teal.700');
  const toast = useToast();
  if (!isGuestMode()) return null;

  function changeSession(reset: boolean) {
    try {
      if (reset) startGuestSession();
      else endGuestSession();
      // A fresh document also discards query caches and open attendance editors.
      window.location.assign(reset ? '/parade' : '/');
    } catch {
      toast({ status: 'error', title: 'Unable to update demo', description: 'Allow browser session storage and try again.' });
    }
  }

  return (
    <Flex as="aside" aria-label="Guest mode" bg={background} borderBottomWidth="1px" borderColor={border}
      px={{ base: 4, md: 5 }} py={4} gap={4} justify="space-between" align={{ base: 'start', md: 'center' }}
      direction={{ base: 'column', md: 'row' }}>
      <Box>
        <HStack mb={1} spacing={2}>
          <Badge colorScheme="teal">Guest mode</Badge>
          <Text fontWeight="semibold" fontSize="sm">A demo you can try</Text>
        </HStack>
        <Text fontSize="sm">Fictional people. Changes stay in this tab. Reset whenever you like.</Text>
      </Box>
      <Flex gap={2} flexShrink={0} flexWrap="wrap">
        <Button size="sm" variant="outline" colorScheme="teal" leftIcon={<RepeatIcon />} onClick={() => changeSession(true)}>Reset demo</Button>
        <Button size="sm" colorScheme="teal" onClick={() => changeSession(false)}>Exit guest mode</Button>
      </Flex>
    </Flex>
  );
}
