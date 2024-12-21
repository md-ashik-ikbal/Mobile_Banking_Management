import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreatePersonalAccountDto, SignupDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SendMoneyDto } from './dto/send-money.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService
  ) {}

  @Post("/signup")
  async Signup(@Body() signupDto: SignupDto) {
    return await this.customerService.Signup(signupDto);
  }

  @Post("/create_personal_account")
  @UseGuards(AuthGuard)
  async Create_Customer(@Request() request, @Body() createPersonalAccountDto: CreatePersonalAccountDto) {
    return await this.customerService.Create_Personal_Account(request.user.sub, createPersonalAccountDto);
    
  }

  @Get("/profile")
  @UseGuards(AuthGuard)
  async Profile(@Request() request) {
    console.log(request.sub)
    return await this.customerService.Profile(request.user.sub);
  }

  @Post("/send_money")
  @UseGuards(AuthGuard)
  async Send_Money(@Request() request, @Body() sendMoneyDto: SendMoneyDto) {
    return await this.customerService.Send_Money(request.user.sub, sendMoneyDto);
  }
}
