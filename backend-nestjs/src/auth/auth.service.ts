import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, LoginDto, SignupDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/auth.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user_repo: Repository<UserEntity>
  ) { };

  async Signup(signupDto: SignupDto): Promise<{ message: string }> {
    try {
      // Check if the user already exists
      const existing_user = await this.user_repo.findOneBy({ user_phone: signupDto.user_phone });

      if (existing_user) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
      
      var new_user: UserEntity = new UserEntity();
      new_user = signupDto;
      new_user.user_password = await bcrypt.hash(signupDto.user_password, 10);
      await this.user_repo.save(new_user);
      return {
        message: 'User signed up successfully',
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw known HTTP errors
      }

      console.error('Error during signup:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

      return { message: "Login success" };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
