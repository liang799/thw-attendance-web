import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ApiClient } from '@/utils/axios';
import { useQueryClient } from 'react-query';

type StopParadeButtonProps = {
  paradeId: number
}

export default function StopParadeButton({ paradeId }: StopParadeButtonProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleClick = async (onClose: () => void) => {
    try {
      await ApiClient.patch(`/parades/${paradeId}`, { endDate: new Date() });
      queryClient.invalidateQueries();
      onClose();
      toast({
        title: 'Successful',
        description: 'Stopped Parade',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: error.name,
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Popover closeOnBlur={false}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Button>{isOpen ? 'Close' : 'Stop Parade'}</Button>
          </PopoverTrigger>
          <Portal>
            <PopoverContent>
              <PopoverArrow />
              <PopoverHeader fontWeight='semibold'>Confirmation</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody>
                <Stack spacing={4}>
                  <Text colorScheme='grey'>
                    Press the button below again to continue.
                  </Text>
                  <Button colorScheme='red' onClick={() => handleClick(onClose)}>Stop Parade</Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
}
