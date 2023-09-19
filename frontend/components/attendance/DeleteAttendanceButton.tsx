import { useToast } from '@chakra-ui/react';
import { ApiClient } from '@/utils/axios';
import { useQueryClient } from 'react-query';
import ConfirmationButton from '@/components/ConfirmationButton';

type ButtonProps = {
  attendanceId?: number | undefined,
}

export default function DeleteAttendanceButton({ attendanceId }: ButtonProps) {
  const toast = useToast();
  const queryClient = useQueryClient();

  if (!attendanceId) {
    toast({
      title: "Something went wrong",
      description: "Attendance ID is null",
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  const handleClick = async (onClose: () => void) => {
    try {
      await ApiClient.delete(`/attendances/${attendanceId}`);
      queryClient.invalidateQueries();
      toast({
        title: 'Successful',
        description: 'Deleted Attendance',
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
      Delete
    </ConfirmationButton>
  );
}
