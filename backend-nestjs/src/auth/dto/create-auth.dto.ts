import { UserEntity } from "src/customer/entities/user.entity";

export class CreateAuthDto {
    session_id: number;
    user_id: number;
    user: UserEntity;
    jwt_token: string;
    creation_date: Date;
    expiration_date: Date;
}

export class LoginDto {
    phone: string;
    password: string;
}
