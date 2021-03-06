import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementColumnTypeTransfer1642889591943 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn(
      'statements',
      'type',
      new TableColumn(
        {
          name: 'type',
          type: 'enum',
          enum: ['deposit', 'withdraw', 'transfer_in', 'transfer_out']
        }
      ))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.changeColumn(
        'statements',
        'type',
        new TableColumn(
          {
            name: 'type',
            type: 'enum',
            enum: ['deposit', 'withdraw']
          }
        ))
    }

}
