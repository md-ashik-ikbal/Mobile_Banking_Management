import { AccountEntity } from "../entities/account.entity";

export class SendMoneyDto {
    transaction_id: number;
    sender_phone: string;
    receiver_phone: string;
    transaction_type: string;
    transaction_amount: number;
    account: AccountEntity;
}