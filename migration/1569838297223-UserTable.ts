import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserTable1569838076666 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "bigint",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },
          {
            name: "username",
            type: "varchar",
            length: "20",
            isUnique: true
          },
          {
            name: "email",
            type: "varchar",
            length: "65",
            isUnique: true
          },
          {
            name: "password",
            type: "varchar",
            length: "60"
          },
          {
            name: "client_id",
            type: "varchar",
            length: "60"
          },
          {
            name: "client_secret",
            type: "varchar",
            length: "60"
          },
          {
            name: "refresh_token",
            type: "varchar",
            length: "60"
          },
          {
            name: "is_verified",
            type: "boolean"
          },
          {
            name: "created_at",
            type: "timestamp"
          },
          {
            name: "updated_at",
            type: "timestamp"
          }
        ]
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable("user");
  }
}
