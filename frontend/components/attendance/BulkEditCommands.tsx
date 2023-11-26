import { attendanceOptions } from "@/config/attendanceOptions";
import { deselectAll, enterBulkEditing } from "@/lib/features/editing-attendance/attendance.slice";
import { AppState } from "@/lib/store";
import { ApiClient } from "@/utils/axios";
import { CreateAttendanceData, UpdateAttendanceData } from "@/utils/types/AttendanceData";
import { ChevronDownIcon, CheckCircleIcon, EditIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem, useMediaQuery, MenuButtonProps, useToast, ButtonProps } from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { useSelector, useDispatch } from "react-redux";

export default function BulkEditCommands({ ...props }: ButtonProps) {
  const uiState = useSelector((state: AppState) => state.attendanceSlice);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const toast = useToast();

  async function markSelectedAsPresent() {
    if (uiState.selected.length <= 0) {
      toast({
        title: 'Invalid target(s)',
        description: 'Please select users',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const present = attendanceOptions.find(option => option.status === 'Present');
    if (!present) throw new Error('Please fix attendance config file!');
    const updatedList = uiState.selected.map(attendance => {
      const data: CreateAttendanceData = {
        id: attendance.id,
        user: attendance.user.id,
        availability: present.availability,
        status: present.status,
      };
      return data;
    })
    try {
      await ApiClient.put(`/attendances`, updatedList);
      await queryClient.invalidateQueries();
      dispatch(deselectAll());
      toast({
        title: "Successful",
        description: "Updated Attendances",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} {...props}>
        With Selected
      </MenuButton>
      <MenuList>
        <MenuItem icon={<CheckCircleIcon />} onClick={() => markSelectedAsPresent()}>
          Mark Present
        </MenuItem>
        <MenuItem icon={<EditIcon />} onClick={() => dispatch(enterBulkEditing())}> Set as...  </MenuItem>
        {/*<MenuItem icon={<ArrowForwardIcon />}>Move to branch...</MenuItem>*/}
        {/*<MenuItem icon={<DeleteIcon />}>Delete</MenuItem>*/}
      </MenuList>
    </Menu>
  );
}
