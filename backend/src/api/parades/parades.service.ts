import { Injectable } from '@nestjs/common';
import { CreateParadeDto } from './dto/create-parade.dto';
import { UpdateParadeDto } from './dto/update-parade.dto';
import { ParadeRepository } from './parade.repository';
import { EntityManager, MikroORM, QueryOrder, UseRequestContext, wrap } from '@mikro-orm/core';
import { Parade } from './entities/parade.entity';
import { FindOneParadeDto } from './dto/find-one-parade.dto';
import { ParadeType } from './type/ParadeType';

@Injectable()
export class ParadesService {
  constructor(
    private readonly repository: ParadeRepository,

    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}

  @UseRequestContext()
  create(dto: CreateParadeDto) {
    const entity = new Parade(dto.type, new Date(dto.startDate));
    return this.em.persistAndFlush(entity);
  }

  @UseRequestContext()
  findAll() {
    return this.repository.findAll();
  }

  @UseRequestContext()
  async findOne(id: number) {
    const parade = await this.repository.findOne(id, {
      populate: ['attendances', 'attendances.user'],
    });
    return new FindOneParadeDto(parade);
  }

  @UseRequestContext()
  async update(id: number, dto: UpdateParadeDto) {
    const parade = await this.repository.findOne(id);
    wrap(parade).assign(dto);
    await this.em.flush();
    return parade;
  }

  @UseRequestContext()
  remove(id: number) {
    return this.repository.nativeDelete(id);
  }

  @UseRequestContext()
  getLatestOngoingParade(): Promise<Parade> {
    return this.repository.findOneOrFail(
      { endDate: null },
      {
        orderBy: { id: QueryOrder.DESC },
      },
    );
  }

  @UseRequestContext()
  async createMidParade() {
    const currentParade = await this.getLatestOngoingParade();
    if (!currentParade) {
      return this.create({ type: ParadeType.MID, startDate: (new Date()).toString() });
    }
    return this.update(currentParade.id, UpdateParadeDto.midParade());
  }

  @UseRequestContext()
  async createFirstParade() {
    const currentParade = await this.getLatestOngoingParade();
    if (!currentParade) {
      await this.create({ type: ParadeType.FIRST, startDate: (new Date()).toString() });
      return;
    }
    await this.update(currentParade.id, UpdateParadeDto.firstParade());
  }
}
