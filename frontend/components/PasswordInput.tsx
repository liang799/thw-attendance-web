import React from "react";
import { InputGroup, InputProps, InputRightElement } from "@chakra-ui/input";
import { Button, Input } from "@chakra-ui/react";

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? "text" : "password"}
        ref={ref}
        {...props}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
