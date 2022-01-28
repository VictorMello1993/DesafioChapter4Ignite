import {Request, Response} from 'express';
import { container } from 'tsyringe';
import { TransferBetweenAccountsUseCase } from './TransferBetweenAccountsUseCase';

class TransferBetweenAccountsController{
  async execute(request: Request, response: Response): Promise<Response> {
    const {id: user_id} = request.user;
    const {id} = request.params;
    const {amount, description} = request.body;

    const transfer = container.resolve(TransferBetweenAccountsUseCase);

    const result = await transfer.execute({amount, description, sender_id: user_id, destination_user_id: id})

    return response.json(result).json(201);
  }
}

export {TransferBetweenAccountsController}
