import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CustomerEntity } from "./customer.entity";

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
    transaction_amount: string;

    @ManyToOne(() => CustomerEntity, (customer) => customer.user_id)
    customer: CustomerEntity;
}