import { Parade } from "./entities/parade.entity";
import { EntityRepository } from "@mikro-orm/mysql";

export class ParadeRepository extends EntityRepository<Parade> {

}
