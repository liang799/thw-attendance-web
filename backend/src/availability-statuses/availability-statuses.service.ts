import { Injectable } from "@nestjs/common";
import { CreateAvailabilityStatusDto } from "./dto/create-availability-status.dto";
import { UpdateAvailabilityStatusDto } from "./dto/update-availability-status.dto";
import { AvailabilityStatusesRepository } from "./availability-statuses.repository";
import { EntityManager, wrap } from "@mikro-orm/core";
import { AvailabilityStatus } from "./entities/availability-status.entity";

@Injectable()
export class AvailabilityStatusesService {
  constructor(
    private readonly repository: AvailabilityStatusesRepository,
    private readonly em: EntityManager
  ) {
  }

  async create(dto: CreateAvailabilityStatusDto) {
    const entity = new AvailabilityStatus(dto.status, dto.availability);
    return this.em.persistAndFlush(entity);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, dto: UpdateAvailabilityStatusDto) {
    const status = await this.repository.findOne(id);
    wrap(status).assign(dto);
    await this.em.flush();
    return status;
  }

  remove(id: number) {
    return this.repository.nativeDelete(id);
  }
}
