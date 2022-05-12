import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserNameAtUsers1652359443279 implements MigrationInterface {
    name = 'AddUserNameAtUsers1652359443279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "userName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userName"`);
    }

}
