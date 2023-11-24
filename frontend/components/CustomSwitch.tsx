import React, { useState, FC } from 'react';
import { Switch as ChakraSwitch, Box, SwitchProps } from '@chakra-ui/react';

interface CustomSwitchProps extends SwitchProps {
  whenEnabled: () => void;
  whenDisabled: () => void;
}

const CustomSwitch: FC<CustomSwitchProps> = ({ whenEnabled, whenDisabled, ...rest }) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchChange = () => {
    setIsSwitchOn(prevState => {
      if (prevState) {
        whenDisabled();
      } else {
        whenEnabled();
      }
      return !prevState;
    });
  };

  return (
    <Box>
      <ChakraSwitch
        onChange={handleSwitchChange}
        isChecked={isSwitchOn}
        {...rest}
      />
    </Box>
  );
};

export default CustomSwitch;
