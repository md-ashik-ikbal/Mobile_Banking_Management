import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { SignupDto } from 'src/auth/dto/create-auth.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post("/signup")
  async Signup(@Body() signupDto: SignupDto) {
    return await this.customerService.Signup(signupDto);
  }

  @Get(":id")
  async Profile(@Param("id") id: number) {
    return await this.customerService.Profile(+id);
  }
}
