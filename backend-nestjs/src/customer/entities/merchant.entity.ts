import { Entity, PrimaryColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("merchant_entity")
export class MerchantEntity {
    @PrimaryColumn()
    user_id: number;

    @Column()
    @Unique(["customer_nid"])
    merchant_nid: string;

    @Column()
    merchant_age: number;

    @OneToOne(() => AccountEntity)
    @JoinColumn({ name: "user_id" })
    account: AccountEntity;
}