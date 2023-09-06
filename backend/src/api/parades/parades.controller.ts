import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete, BadRequestException,
} from '@nestjs/common';
import { ParadesService } from './parades.service';
import { CreateParadeDto } from './dto/create-parade.dto';
import { UpdateParadeDto } from './dto/update-parade.dto';

@Controller('parades')
export class ParadesController {
  constructor(private readonly paradesService: ParadesService) {}

  @Post()
  create(@Body() createParadeDto: CreateParadeDto) {
    return this.paradesService.create(createParadeDto);
  }

  @Get()
  findAll() {
    return this.paradesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!Number(id)) throw new BadRequestException();
    return this.paradesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParadeDto: UpdateParadeDto) {
    if (!Number(id)) throw new BadRequestException();
    return this.paradesService.update(+id, updateParadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!Number(id)) throw new BadRequestException();
    return this.paradesService.remove(+id);
  }

  @Post(':id/attendance')
  createAttendance(@Body() createParadeDto: CreateParadeDto) {
    return this.paradesService.create(createParadeDto);
  }
}
