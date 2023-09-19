import { useToast } from '@chakra-ui/react';
import { ApiClient } from '@/utils/axios';
import { useQueryClient } from 'react-query';
import ConfirmationButton from '@/components/ConfirmationButton';

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
    <ConfirmationButton handleClick={handleClick}>
      Stop Parade
    </ConfirmationButton>
  );
}
