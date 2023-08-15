import { Seeder } from "@mikro-orm/seeder";
import { EntityManager } from "@mikro-orm/mysql";
import { User } from "../api/users/entities/user.entity";
import { BranchType } from "../api/users/types/BranchType";
import { Auth } from "../api/auth/entities/auth.entity";
import * as bcrypt from "bcrypt";

export class UserSeeder extends Seeder {
  private usernameCounts = {};
  private password = "1234"

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

const users = [
  // "Commanders": [
  { "rank": "2WO", "name": "Nazly", "type": BranchType.COMMANDER },
  { "rank": "CPT", "name": "KHALID", "type": BranchType.COMMANDER },
  // ],
  // "S3": [
  { "rank": "PTE", "name": "Joshua Leong", "type": BranchType.S3 },
  { "rank": "PTE", "name": "William", "type": BranchType.S3 },
  { "rank": "REC", "name": "Looi Jee Luck", "type": BranchType.S3 },
  { "rank": "REC", "name": "NG ZI HENG", "type": BranchType.S3 },
  { "rank": "REC", "name": "Muthu", "type": BranchType.S3 },
  { "rank": "REC", "name": "NEOH TIAN POK", "type": BranchType.S3 },
  { "rank": "CPL", "name": "Denzel", "type": BranchType.S3 },
  { "rank": "PTE", "name": "BRIEN", "type": BranchType.S3 },
  { "rank": "PTE", "name": "LOKE SZE IAN JOEL", "type": BranchType.S3 },
  { "rank": "PTE", "name": "AYUSH", "type": BranchType.S3 },
  { "rank": "REC", "name": "LOW XING LE ADEN", "type": BranchType.S3 },
  { "rank": "REC", "name": "JORDAN RIATONO", "type": BranchType.S3 },
  // ],
  // "S1": [
  { "rank": "REC", "name": "Lucas Lam", "type": BranchType.S1 },
  { "rank": "PTE", "name": "Ryan Lee", "type": BranchType.S1 },
  { "rank": "PTE", "name": "YALIN", "type": BranchType.S1 },
  { "rank": "PTE", "name": "TANG KAI LE", "type": BranchType.S1 },
  { "rank": "PTE", "name": "Jagan", "type": BranchType.S1 },
  { "rank": "PTE", "name": "YE HTUT LINN", "type": BranchType.S1 },
  { "rank": "PTE", "name": "Rahman", "type": BranchType.S1 },
  { "rank": "CPL", "name": "CLYDE JOSIAH CLEMENT", "type": BranchType.S1 },
  { "rank": "PTE", "name": "NICO LIM", "type": BranchType.S1 },
  { "rank": "PTE", "name": "Cameron Yeo", "type": BranchType.S1 },
  { "rank": "PTE", "name": "Jerome Lam", "type": BranchType.S1 },
  { "rank": "PTE", "name": "Hrithhish", "type": BranchType.S1 },
  { "rank": "PTE", "name": "Matteo", "type": BranchType.S1 },
  { "rank": "PTE", "name": "HUANG YUXUAN", "type": BranchType.S1 },
  { "rank": "PTE", "name": "SAIKIRAN", "type": BranchType.S1 },
  // ],
  // "Transition": [
  { "rank": "PTE", "name": "Rishi", "type": BranchType.TRANSITION },
  { "rank": "PTE", "name": "Jerrell Khoo", "type": BranchType.TRANSITION },
  { "rank": "PTE", "name": "Gerald Koh", "type": BranchType.TRANSITION },
  { "rank": "PTE", "name": "Reagan Francis", "type": BranchType.TRANSITION },
  // ],
  // "S4": [
  { "rank": "PTE", "name": "LIM YU ZHENG", "type": BranchType.S4 },
  { "rank": "REC", "name": "AKSHAY KUMAR", "type": BranchType.S4 },
  { "rank": "PTE", "name": "Dhanial", "type": BranchType.S4 },
  { "rank": "REC", "name": "Kyaw Zayar Win", "type": BranchType.S4 },
  { "rank": "PTE", "name": "Arvind jayakumar", "type": BranchType.S4 },
  { "rank": "PTE", "name": "M Ashween Khamal", "type": BranchType.S4 },
  { "rank": "PTE", "name": "Prateek", "type": BranchType.S4 },
  { "rank": "PTE", "name": "Arfan", "type": BranchType.S4 },
  { "rank": "PTE", "name": "Samuel Quek", "type": BranchType.S4 },
  { "rank": "PTE", "name": "Samuel Tay", "type": BranchType.S4 }
  // ]
];

