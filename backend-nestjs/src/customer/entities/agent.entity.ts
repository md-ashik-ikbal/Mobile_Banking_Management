import { Entity, PrimaryColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm";
import { AccountEntity } from "./account.entity";

@Entity("agent_entity")
@Unique(["agent_nid"])
export class AgentEntity {
    @PrimaryColumn()
    user_id: number;

    @Column()
    agent_nid: string;

    @Column()
    agent_age: number;

    @OneToOne(() => AccountEntity)
    @JoinColumn({ name: "user_id" })
    account: AccountEntity;
}