import {
	Button,
	Container,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Select,
	Stack,
	useColorModeValue, useToast,
} from '@chakra-ui/react';
import PasswordInput from '@/components/PasswordInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ApiClient } from '@/utils/axios';
import * as yup from 'yup';
import Navbar from '@/components/Navbar';
import { useAuthentication } from '@/utils/auth';

const schema = yup.object({
	userType: yup.string().required(),
	rank: yup.string().required(),
	name: yup.string().required(),
});

type CreateUserData = {
	userType: string;
	rank: string;
	name: string;
}

export enum UserType {
	COMMANDER = 'Commander',
	S1 = 'S1 Branch',
	S3 = 'S3 Branch',
	S4 = 'S4 Branch',
	MEDIA = 'Media Team',
	TRANSITION = 'Transition',
}


export default function CreatePasswordPage() {
	const toast = useToast();
	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

	useAuthentication();

	const onSubmit = async (dto: CreateUserData) => {
		const data = { type: dto.userType, rank: dto.rank, name: dto.name };
		try {
			await ApiClient.post('/users', data);
			toast({
				title: 'Success',
				description: 'Created User',
				status: 'success',
				duration: 5000,
				isClosable: true,
			});
		} catch (error: any) {
			if (error.response.status === 401) {
				toast({
					title: 'Error',
					description: 'Unable to update due to wrong old password',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				return;
			}
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
		<Container maxW='container.xl' minH='100vh' bg={useColorModeValue('gray.50', 'gray.800')}>
			<Stack p={5}>
				<Navbar />
				<Flex p={5} align='center' justify='center' flexDirection='column'>
					<Heading p={5}>Create User</Heading>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FormControl isInvalid={!!errors.userType}>
							<FormLabel htmlFor='userType'>User Type</FormLabel>
							<Select id='userType' placeholder='Select option' {...register('userType')}>
								<option value='Commander'>Commander</option>
								<option value='S1 Branch'>S1 Branch</option>
								<option value='S3 Branch'>S3 Branch</option>
								<option value='S4 Branch'>S4 Branch</option>
								<option value='Media Team'>Media</option>
								<option value='Transition'>Transition</option>
							</Select>
							<FormErrorMessage>{errors.userType?.message}</FormErrorMessage>
						</FormControl>
						<FormControl isInvalid={!!errors.rank}>
							<FormLabel htmlFor='rank'>Rank</FormLabel>
							<Input {...register('rank')} />
							<FormErrorMessage>{errors.rank?.message}</FormErrorMessage>
						</FormControl>
						<FormControl isInvalid={!!errors.name}>
							<FormLabel htmlFor='name'>Name</FormLabel>
							<Input {...register('name')} />
							<FormErrorMessage>{errors.name?.message}</FormErrorMessage>
						</FormControl>
						<Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
							Submit
						</Button>
					</form>
				</Flex>
			</Stack>
		</Container>
	);

}