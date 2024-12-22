import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { AccountEntity } from "./account.entity";


@Entity("payment_entity")
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column({ unique: true })
    payment_token: string;

    @Column()
    payment_for: string;

    @Column()
    payment_to: number;

    @Column()
    payment_amount: number;

    @Column()
    payment_status: string;
}