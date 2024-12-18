import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post("/login")
  async Login(@Body() loginDto: LoginDto) {
    return await this.authService.Login(loginDto);
  }
}
