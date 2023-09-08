import React from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { InputProps } from '@chakra-ui/input';

export const SearchBar = ({ ...rest }: InputProps) => {
  return (
    <InputGroup borderRadius={5} size='sm'>
      <InputLeftElement pointerEvents='none'>
        <Search2Icon color='gray.600' />
      </InputLeftElement>

      <Input
        type='text'
        {...rest}
      />
    </InputGroup>
  );
};
