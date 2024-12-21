import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { CustomerEntity } from "./customer.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity("account_entity")
export class AccountEntity {
    @PrimaryColumn()
    user_id: number;

    @Column()
    account_balance: number;

    @Column()
    account_type: string;

    @Column()
    account_creation_time: Date;

    @OneToMany(() => TransactionEntity, (transaction) => transaction.transaction_id)
    transactions: TransactionEntity[];
}