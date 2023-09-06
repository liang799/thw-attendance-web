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
import { useRef } from 'react';

type StopParadeButtonProps = {
  paradeId: number
}

export default function StopParadeButton({ paradeId }: StopParadeButtonProps) {
  const initRef = useRef();
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
    } catch (error) {
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
    <Popover closeOnBlur={false} initialFocusRef={initRef}>
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
                  <Button colorScheme='red' onClick={() => handleClick(onClose)} ref={initRef}>Stop Parade</Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
}
