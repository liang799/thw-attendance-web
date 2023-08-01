import { AvailabilityStatus } from "./entities/availability-status.entity";
import { EntityRepository } from "@mikro-orm/mysql";

export class AvailabilityStatusesRepository extends EntityRepository<AvailabilityStatus> {

}
