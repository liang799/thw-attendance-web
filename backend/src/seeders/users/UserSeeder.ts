import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/mysql';
import { User } from '../../api/users/entities/user.entity';
import { Auth } from '../../api/auth/entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { users } from './UserData';
import 'dotenv/config';
import { BranchType } from '../../api/users/types/BranchType';

interface UserData {
  rank: string;
  name: string;
  type: BranchType;
}

interface GeneratedUsername {
  user: UserData;
  userName: string;
}

export class UserSeeder extends Seeder {
  private usersWithUsernames = this.generateUsernames(users);
  private password = process.env.USER_DEFAULT_PASSWORD;

  async run(em: EntityManager): Promise<void> {
    for (const userWithUserName of this.usersWithUsernames) {
      const data = userWithUserName.user;
      const user = new User();
      user.type = data.type;
      user.rank = data.rank;
      user.name = data.name;
      await em.persist(user);

      const auth = new Auth();
      auth.user = user;
      auth.username = userWithUserName.userName;
      auth.password = await bcrypt.hash(this.password, 5);
      await em.persist(auth);
    }
    await em.flush();
  }

  private generateUsernames(users: UserData[]): GeneratedUsername[] {
    const usedIds = new Set();

    function generateUsername(user) {
      const initials = user.name
        .split(' ')
        .map((word) => word[0])
        .join('');
      let id;
      do {
        id = Math.floor(Math.random() * 100);
      } while (usedIds.has(id));
      usedIds.add(id);
      return `${initials}${id}`;
    }

    return users.map((user) => ({
      user: { ...user },
      userName: generateUsername(user),
    }));
  }
}
