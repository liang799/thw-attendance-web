import { PartialType } from '@nestjs/mapped-types';
import { CreateParadeDto } from './create-parade.dto';

export class UpdateParadeDto extends PartialType(CreateParadeDto) {
}
