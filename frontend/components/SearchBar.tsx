import React, { ChangeEventHandler } from 'react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

type SearchBarProps = {
  handleChange: ChangeEventHandler<HTMLInputElement>
}
export const SearchBar = ({ handleChange }: SearchBarProps) => {
  return (
    <InputGroup borderRadius={5} size='sm'>
      <InputLeftElement
        pointerEvents='none'
        children={<Search2Icon color='gray.600' />}
      />
      <Input
        type='text'
        placeholder='Search...'
        onChange={handleChange}
      />
    </InputGroup>
  );
};
