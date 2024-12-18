import { Entity, PrimaryColumn, OneToOne, JoinColumn, Column } from "typeorm";
import { CustomerEntity } from "./customer.entity";

@Entity("account_entity")
export class AccountEntity {
    @PrimaryColumn()
    user_id: number;

    @OneToOne(() => CustomerEntity)
    @JoinColumn({ name: "user_id" })
    user: CustomerEntity;

    @Column()
    account_balance: number;

    // Add a OneToOne relation with CustomerEntity
    @OneToOne(() => CustomerEntity, customer => customer.account)
    customer: CustomerEntity; // relation to CustomerEntity
}