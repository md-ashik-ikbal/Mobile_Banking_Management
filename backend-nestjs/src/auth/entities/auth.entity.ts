import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "src/customer/entities/user.entity";

@Entity("session_entity")
export class SessionEntity {
    @PrimaryGeneratedColumn()
    session_id: number;

    @Column()
    user_id: number;
    
    @OneToOne(() => UserEntity)
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column()
    jwt_token: string;

    @Column()
    creation_date: string;

    @Column()
    expiration_date: string;
}