import { TransactionEntity } from "../entities/transaction.entity";

export class CreateAccontDto {
    user_id: number;
    account_balance: number;
    account_type: string;
    transactions: TransactionEntity[];
}