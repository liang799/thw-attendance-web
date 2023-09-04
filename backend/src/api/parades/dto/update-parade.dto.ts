import { PartialType } from '@nestjs/mapped-types';
import { CreateParadeDto } from './create-parade.dto';
import { ParadeType } from '../type/ParadeType';

export class UpdateParadeDto extends PartialType(CreateParadeDto) {
  static firstParade() {
    const dto = new UpdateParadeDto();
    dto.startDate = new Date().toString();
    dto.type = ParadeType.FIRST;
    return dto;
  }

  static midParade() {
    const dto = new UpdateParadeDto();
    dto.startDate = new Date().toString();
    dto.type = ParadeType.MID;
    return dto;
  }
}
