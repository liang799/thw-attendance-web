import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, HttpCode } from "@nestjs/common";
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendancesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendancesService.update(+id, updateAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(+id);
  }
}
