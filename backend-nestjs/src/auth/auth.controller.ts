import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginDto, SignupDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post("/signup")
  async Signup(@Body() signupDto: SignupDto) {
    return await this.authService.Signup(signupDto);
  }

  @Post("/login")
  async Login(@Body() loginDto: LoginDto) {
    return await this.authService.Login(loginDto);
  }
}
