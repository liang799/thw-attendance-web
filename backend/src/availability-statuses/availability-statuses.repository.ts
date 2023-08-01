import { EntityRepository } from "@mikro-orm/mongodb";
import { AvailabilityStatus } from "./entities/availability-status.entity";

export class AvailabilityStatusesRepository extends EntityRepository<AvailabilityStatus> {

}
