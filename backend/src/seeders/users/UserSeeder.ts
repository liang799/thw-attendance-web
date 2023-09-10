import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/mysql";
import { User } from "../../api/users/entities/user.entity";
import { Auth } from "../../api/auth/entities/auth.entity";
import * as bcrypt from "bcrypt";
import { users } from './UserData';
import 'dotenv/config';

export class UserSeeder extends Seeder {
  private usernameCounts = {};
  private password = process.env.USER_DEFAULT_PASSWORD;

  async run(em: EntityManager): Promise<void> {
    for (const data of users) {
      const user = new User();
      user.type = data.type;
      user.rank = data.rank;
      user.name = data.name;
      await em.persist(user);

      const auth = new Auth();
      auth.user = user;
      auth.username = this.generateUsername(data.name, data.type);
      auth.password = await bcrypt.hash(this.password, 5);
      await em.persist(auth);
    }
    await em.flush();
  }

  private generateUsername(name, branchType) {
    const initials = name
      .split(" ")
      .map(word => word[0])
      .join("");

    if (!(this.usernameCounts)[branchType]) {
      (this.usernameCounts)[branchType] = 1;
    }

    const username = `${initials}${(this.usernameCounts)[branchType]}`;
    (this.usernameCounts)[branchType]++;

    return username;
  };
}


