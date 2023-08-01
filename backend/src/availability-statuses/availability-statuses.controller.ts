import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { AvailabilityStatusesService } from "./availability-statuses.service";
import { CreateAvailabilityStatusDto } from "./dto/create-availability-status.dto";
import { UpdateAvailabilityStatusDto } from "./dto/update-availability-status.dto";

@Controller("availability-statuses")
export class AvailabilityStatusesController {
  constructor(private readonly availabilityStatusesService: AvailabilityStatusesService) {
  }

  @Post()
  async create(@Body() createAvailabilityStatusDto: CreateAvailabilityStatusDto) {
      return this.availabilityStatusesService.create(createAvailabilityStatusDto);
  }

  @Get()
  findAll() {
    return this.availabilityStatusesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.availabilityStatusesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAvailabilityStatusDto: UpdateAvailabilityStatusDto) {
    return this.availabilityStatusesService.update(id, updateAvailabilityStatusDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.availabilityStatusesService.remove(id);
  }
}
