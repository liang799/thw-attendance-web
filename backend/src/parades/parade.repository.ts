import { EntityRepository } from "@mikro-orm/mongodb";
import { Parade } from "./entities/parade.entity";

export class ParadeRepository extends EntityRepository<Parade> {

}
