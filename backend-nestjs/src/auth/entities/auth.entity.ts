import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_entity")
export class UserEntity {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    user_phone: string;
    
    @Column()
    user_email: string;

    @Column()
    user_role: string;

    @Column()
    user_password: string;
}
