import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferBetweenAccountsError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class SenderUserIsReceiverUser extends AppError {
    constructor() {
      super('Sender user is receiver user', 400);
    }
  }
}
