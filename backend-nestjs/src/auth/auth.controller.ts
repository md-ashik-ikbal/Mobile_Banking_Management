import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  Res
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

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
  async Login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const jwt_token = await this.authService.Login(loginDto);
    return res.send(jwt_token);
  }

  @UseGuards(AuthGuard)
  @Get("/logout")
  async Logout(@Request() request, @Res() res: Response) {
    const token = this.authService.extract_token_from_header(request);

    try {
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      const token_for = request.user.phone;
      res.clearCookie(`jwt_token_for_${token_for}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      await this.authService.Logout(request.user.user_phone, token);

      return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);

      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
