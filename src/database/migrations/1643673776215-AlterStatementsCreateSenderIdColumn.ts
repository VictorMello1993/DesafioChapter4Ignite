import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class AlterStatementsCreateSenderIdColumn1643673776215 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('statements', new TableColumn(
        {
          name: 'sender_id',
          type: 'uuid',
          isNullable: true
        }
      ))

      await queryRunner.createForeignKey("statements", new TableForeignKey({
        name: 'FKSpecificationUserSender',
        columnNames: ["sender_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
        onUpdate: 'CASCADE'
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('statements', 'FKSpecificationUserSender');
    }

}
