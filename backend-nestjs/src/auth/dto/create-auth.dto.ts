export class CreateAuthDto {}

export class SignupDto {
    user_id: number;
    user_name: string;
    user_phone: string;
    user_email: string;
    user_role: string;
    user_password: string;
}

export class LoginDto {
    phone: string;
    password: string;
}
