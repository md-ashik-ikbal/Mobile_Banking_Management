import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { UserEntity } from 'src/customer/entities/user.entity';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { SessionEntity } from './entities/auth.entity';
import { TokenBlacklistService } from './token-blacklist/token-blacklist.service';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user_repo: Repository<UserEntity>,

    @InjectRepository(SessionEntity)
    private readonly session_repo: Repository<SessionEntity>,

    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService
  ) { };

  async generate_token(id: number, phone: string) {
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

      const get_valid_token = await this.session_repo.findOne({
        where: {
          user_id: user.user_id,
          expiration_date: MoreThan(new Date())
        }
      });

      if (get_valid_token) {
        return get_valid_token;
      }

      var new_session: SessionEntity = new SessionEntity();
      var createAuthDto: CreateAuthDto = new CreateAuthDto();

      createAuthDto.user_id = user.user_id;
      createAuthDto.user = user;
      createAuthDto.jwt_token = await this.generate_token(user.user_id, user.user_phone);
      createAuthDto.creation_date = new Date();
      createAuthDto.expiration_date = new Date(new Date().getTime() + 30 * 60 * 1000);
      new_session = createAuthDto;
      await this.session_repo.save(new_session);
      const { user_password, ...userWithoutPassword } = new_session.user;

      // Return the session with the user data excluding the password
      return {
        ...new_session,
        user: userWithoutPassword,
      }

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  extract_token_from_header(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }

  async Logout(phone: string, token: string) {
    return await this.tokenBlacklistService.add_token_blacklist(phone, token);
  }
}
