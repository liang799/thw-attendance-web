import {
  Button,
  ButtonProps,
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
} from '@chakra-ui/react';

type ConfirmationButtonProps = {
  handleClick: (onClose: () => void) => Promise<void> | void;
} & ButtonProps

export default function ConfirmationButton({ handleClick, ...props }: ConfirmationButtonProps) {
  return (
    <Popover closeOnBlur={false}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Button {...props}>
              {isOpen ? 'Cancel' : props.children}
            </Button>
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
                  <Button colorScheme='red' onClick={() => handleClick(onClose)}>{props.children}</Button>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </>
      )}
    </Popover>
  );
}
