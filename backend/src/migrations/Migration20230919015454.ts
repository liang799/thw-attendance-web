import { Migration } from '@mikro-orm/migrations';

export class Migration20230919015454 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `parade` (`id` int unsigned not null auto_increment primary key, `start_date` datetime not null, `end_date` datetime null) default character set utf8mb4 engine = InnoDB;');

    this.addSql('create table `user` (`id` int unsigned not null auto_increment primary key, `type` enum(\'Commander\', \'Transition\', \'S1 Branch\', \'S3 Branch\', \'S4 Branch\') not null, `rank` varchar(255) not null, `name` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `user` add index `user_type_index`(`type`);');

    this.addSql('create table `auth` (`id` int unsigned not null auto_increment primary key, `username` varchar(255) not null, `password` varchar(255) not null, `user_id` int unsigned null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `auth` add unique `auth_username_unique`(`username`);');
    this.addSql('alter table `auth` add unique `auth_user_id_unique`(`user_id`);');

    this.addSql('create table `attendance` (`id` int unsigned not null auto_increment primary key, `user_id` int unsigned not null, `availability_status` varchar(255) not null, `availability_type` enum(\'Present\', \'Absent\') not null, `availability_dispatch_location` varchar(255) null, `availability_absent_start_date` datetime null, `availability_absent_end_date` datetime null, `parade_id` int unsigned not null, `submitted_at` datetime not null) default character set utf8mb4 engine = InnoDB;');
    this.addSql('alter table `attendance` add index `attendance_user_id_index`(`user_id`);');
    this.addSql('alter table `attendance` add index `attendance_parade_id_index`(`parade_id`);');

    this.addSql('alter table `auth` add constraint `auth_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete set null;');

    this.addSql('alter table `attendance` add constraint `attendance_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;');
    this.addSql('alter table `attendance` add constraint `attendance_parade_id_foreign` foreign key (`parade_id`) references `parade` (`id`) on update cascade;');
  }

}
