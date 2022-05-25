import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedDb1652338894565 implements MigrationInterface {
  name = "SeedDb1652338894565";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dungeon'), ('master'), ('300')`
    );

    await queryRunner.query(
      `INSERT INTO users ("userName", email, password) VALUES ('foo', 'foo@mail.com', '$2b$10$Lb8kByh6TqT1OsNvfiu2MeaB4zj43326CgWK8nU9sWhX6t7Y3BgkC')`
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'first article', 'first description', 'first body', 'dungeon,master', 1)`
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'second article', 'second description', 'second body', 'dungeon,master', 1)`
    );
  }

  public async down(): Promise<void> {}
}
