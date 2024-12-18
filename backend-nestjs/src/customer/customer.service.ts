import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto, SignupDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user_repo: Repository<UserEntity>
  ) {}

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

  async Profile(id: number) {
    try {
      // Try to find the customer by user_id
      const get_customer = await this.user_repo.findOneBy({ user_id: id });

      // If no customer found, throw a NotFoundException
      if (!get_customer) {
        throw new NotFoundException('User not found');
      }

      // Return the found customer
      return get_customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Don't catch NotFoundException as it's handled already
        throw error;
      }

      throw new InternalServerErrorException('An error occurred while fetching the user profile');
    }
  }
}
