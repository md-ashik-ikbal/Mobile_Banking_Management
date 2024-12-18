import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, LoginDto, SignupDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user_repo: Repository<UserEntity>,

    private readonly jwtService: JwtService
  ) { };

  async get_token(id: number, phone: string) {
    return await this.jwtService.signAsync(
      {
        sub: id,
        phone
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m'
      }
    );
  }

  async Login(loginDto: LoginDto) {
    const { phone, password } = loginDto;

    try {
      const user = await this.user_repo.findOneBy({ user_phone: phone });

      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      const is_valid = await bcrypt.compare(password, user.user_password);

      if (!is_valid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return { access_token: await this.get_token(user.user_id, user.user_phone) };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
