import { PartialType } from '@nestjs/mapped-types';
import { CreateAvailabilityStatusDto } from './create-availability-status.dto';

export class UpdateAvailabilityStatusDto extends PartialType(CreateAvailabilityStatusDto) {}
