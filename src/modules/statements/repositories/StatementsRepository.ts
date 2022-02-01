import { getRepository, Repository } from "typeorm";
import { OperationType, Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementByUserDTO, IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
    sender_id
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = !type.includes('transfer') ? this.repository.create({
      user_id,
      amount,
      description,
      type,
    }) : this.repository.create({
      user_id,
      amount,
      description,
      type,
      sender_id
    })

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, sender_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const indexTransfer = statement.findIndex(stm => stm.type === 'transfer_in');

    if(indexTransfer !== - 1){
      statement[indexTransfer].user_id = sender_id;
    }

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === 'transfer_in') {
        return acc + Number(operation.amount.toString());
      } else if(operation.type === 'withdraw' || operation.type === 'transfer_out') {
        return acc - Number(operation.amount.toString());
      }
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }

  async findStatementByUser ({user_id}: IGetStatementByUserDTO): Promise<Statement[]>{
    const statements = this.repository.find({where: {user_id}})
    return statements;
  }
}
