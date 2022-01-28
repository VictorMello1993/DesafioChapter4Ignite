import { OperationType, Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({ statement, balance }: { statement: Statement[], balance: number }) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at,
      user_id
    }) => {
      if (type === OperationType.TRANSFEROUT) {
        return {
          id,
          sender_id: user_id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        }
      }
      return {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
