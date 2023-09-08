import React, { ChangeEventHandler } from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

type SearchBarProps = {
  onChange: ChangeEventHandler<HTMLInputElement>; // Rename handleChange to onChange
};

export const SearchBar = ({ onChange }: SearchBarProps) => {
  return (
    <InputGroup borderRadius={5} size='sm'>
      <InputLeftElement pointerEvents='none'>
        <Search2Icon color='gray.600' />
      </InputLeftElement>

      <Input
        type='text'
        placeholder='Search...'
        onChange={onChange} // Use the provided onChange prop
      />
    </InputGroup>
  );
};
