import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, Unique } from "typeorm";
import { AccountEntity } from "./account.entity";

export class Customer {}

@Entity("customer_entity")
export class CustomerEntity {
    @PrimaryColumn()
    user_id: number;

    @Column()
    @Unique(["user_nid"])
    customer_nid: string;

    @Column()
    customer_age: number;

    @OneToOne(() => AccountEntity)
    @JoinColumn({ name: "user_id" })
    account: AccountEntity;
}