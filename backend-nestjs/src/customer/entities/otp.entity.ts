import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class OtpEntity {
    @PrimaryColumn()
    user_email: string

    @Column()
    otp: string;

    @Column()
    generation_time: Date;

    @Column()
    expiration_time: Date;
}