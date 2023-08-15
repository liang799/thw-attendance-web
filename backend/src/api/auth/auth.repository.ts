import { EntityRepository } from '@mikro-orm/core';
import { Auth } from "./entities/auth.entity";

export class AuthRepository extends EntityRepository<Auth> {}
