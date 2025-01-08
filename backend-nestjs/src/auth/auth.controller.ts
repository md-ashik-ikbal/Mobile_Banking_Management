import { Controller, Post, Body, Get, UseGuards, Request, HttpException, HttpStatus, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Post("/validate_phone")
  async Validate_Phone(@Body() loginDto: Partial<LoginDto>) {
    return await this.authService.Validate_Phone(loginDto.phone);
  }

  @Post("/login")
  async Login(@Body() loginDto: LoginDto) {
    return await this.authService.Login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Get("/logout")
  async Logout(@Request() request) {
    const token = this.authService.extract_token_from_header(request); 

    try {
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      return await this.authService.Logout(request.user.user_phone, token);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
