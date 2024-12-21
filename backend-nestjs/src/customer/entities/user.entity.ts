import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm";
import { CustomerEntity } from "./customer.entity";

@Entity("user_entity")
export class UserEntity {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    @Unique(["user_phone"])
    user_phone: string;
    
    @Column()
    @Unique(["user_email"])
    user_email: string;

    @Column()
    user_role: string;

    @Column()
    user_password: string;

    @OneToOne(() => CustomerEntity)
    customer: CustomerEntity;
}