import { Migration } from '@mikro-orm/migrations';

export class Migration20230922021909 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` modify `type` enum(\'Commander\', \'S1 Branch\', \'S3 Branch\', \'S4 Branch\', \'Media Team\', \'Transition\') not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` modify `type` enum(\'Commander\', \'Transition\', \'S1 Branch\', \'S3 Branch\', \'S4 Branch\') not null;');
  }

}
