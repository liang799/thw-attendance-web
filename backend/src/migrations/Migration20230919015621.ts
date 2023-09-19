import { Migration } from '@mikro-orm/migrations';

export class Migration20230919015621 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add `has_left_node` tinyint(1) not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop `has_left_node`;');
  }

}
