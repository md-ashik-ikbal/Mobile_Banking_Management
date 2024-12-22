import { AccountEntity } from "../entities/account.entity";

export class MakePaymentDto {
    payment_id: number;
    payment_token: string;
    payment_for: string;
    payment_to: string;
    payment_amount: number;
    payment_status: string;
}