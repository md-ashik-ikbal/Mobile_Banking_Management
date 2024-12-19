import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from "./user.entity";
import { AccountEntity } from "./account.entity";
import { TransactionEntity } from "./transaction.entity";

export class Customer {}

@Entity("customer_entity")
export class CustomerEntity {
    @PrimaryColumn()
    user_id: number;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column()
    @Unique(["user_nid"])
    customer_nid: string;

    @Column()
    customer_age: number;

    // Add a OneToOne relation with AccountEntity
    @OneToOne(() => AccountEntity)
    account: AccountEntity; // relation to AccountEntity

    @OneToMany(() => TransactionEntity, (transaction) => transaction.transaction_id)
    transactions: TransactionEntity[];

}