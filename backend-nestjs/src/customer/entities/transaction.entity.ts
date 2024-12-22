import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("transaction_entity")
export class TransactionEntity {
    @PrimaryGeneratedColumn()
    transaction_id: number;

    @Column()
    sender_phone: string;

    @Column()
    receiver_phone: string;

    @Column()
    transaction_type: string;

    @Column()
    transaction_amount: number;

    @Column()
    transaction_time: Date;

    @ManyToOne(() => AccountEntity, (account) => account.user_id)
    account: AccountEntity;
}