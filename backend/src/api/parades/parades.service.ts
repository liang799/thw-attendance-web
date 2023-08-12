import { Injectable } from "@nestjs/common";
import { CreateParadeDto } from "./dto/create-parade.dto";
import { UpdateParadeDto } from "./dto/update-parade.dto";
import { ParadeRepository } from "./parade.repository";
import { EntityManager, QueryOrder, wrap } from "@mikro-orm/core";
import { Parade } from "./entities/parade.entity";

@Injectable()
export class ParadesService {
  constructor(
    private readonly repository: ParadeRepository,
    private readonly em: EntityManager
  ) {
  }

  create(dto: CreateParadeDto) {
    const entity = new Parade(dto.type, new Date(dto.startDate));
    return this.em.persistAndFlush(entity);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, dto: UpdateParadeDto) {
    const parade = await this.repository.findOne(id);
    wrap(parade).assign(dto);
    await this.em.flush();
    return parade;
  }

  remove(id: number) {
    return this.repository.nativeDelete(id);
  }

  getLatestOngoingParade() {
    return this.repository.findOneOrFail({ endDate: null }, {
      orderBy: { id: QueryOrder.DESC }
    });
  }
}
