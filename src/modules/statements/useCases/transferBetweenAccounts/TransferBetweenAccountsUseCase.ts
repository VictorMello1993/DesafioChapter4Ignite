import { OperationType } from "modules/statements/entities/Statement";
import { IStatementsRepository } from "modules/statements/repositories/IStatementsRepository"
import { IUsersRepository } from "modules/users/repositories/IUsersRepository"
import { inject, injectable } from "tsyringe"
import { TransferBetweenAccountsError } from "./TransferBetweenAccountsError";

interface IRequest {
  amount: number
  description: string;
  sender_id: string;
  destination_user_id: string;
}

@injectable()
class TransferBetweenAccountsUseCase{
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ){}

  async execute({amount, description, sender_id, destination_user_id}: IRequest): Promise<void>{
    const destinationUser = await this.usersRepository.findById(destination_user_id);
    const senderUser = await this.usersRepository.findById(sender_id);

    if(!destinationUser || !senderUser){
      throw new TransferBetweenAccountsError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if(balance < amount){
      throw new TransferBetweenAccountsError.InsufficientFunds();
    }

    await this.statementsRepository.create({user_id: sender_id, type: OperationType.TRANSFEROUT, amount, description})
    await this.statementsRepository.create({user_id: destination_user_id, type: OperationType.TRANSFERIN, amount, description})
  }
}

export {TransferBetweenAccountsUseCase}
