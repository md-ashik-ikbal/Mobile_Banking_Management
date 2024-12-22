export class ChangePasswordDto {
    user_email: string;
    otp: string;
    new_password: string;
    confirm_password: string;
}