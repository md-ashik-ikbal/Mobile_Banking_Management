import { AccountEntity } from "../entities/account.entity";
import { CustomerEntity } from "../entities/customer.entity";

export class CreateCustomerDto {}

export class CreatePersonalAccountDto {
    user_id: number;
    customer_nid: string;
    customer_age: number;
    account: AccountEntity;
}


export class SignupDto {
    user_id: number;
    user_name: string;
    user_phone: string;
    user_email: string;
    user_role: string;
    user_password: string;
    customer: CustomerEntity;
}