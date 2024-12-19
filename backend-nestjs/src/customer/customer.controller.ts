import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto, SignupDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService
  ) {}

  @Post("/signup")
  async Signup(@Body() signupDto: SignupDto) {
    return await this.customerService.Signup(signupDto);
  }

  @Get("/profile")
  @UseGuards(AuthGuard)
  async Profile(@Request() req) {
    return await this.customerService.Profile(req.user.user_id);
  }
}
