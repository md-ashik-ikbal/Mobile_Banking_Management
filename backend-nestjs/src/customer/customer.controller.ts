import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreatePersonalAccountDto, SignupDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SendMoneyDto } from './dto/send-money.dto';
import { MakePaymentDto } from './dto/make-payment.dto';
import { CahsOutDto } from './dto/cash-out.dto';
import { MailService } from './mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly mailService: MailService
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

  @Post("/make_payment")
  @UseGuards(AuthGuard)
  async Make_Payment(@Request() request, @Body() makePaymentDto: MakePaymentDto) {
    return await this.customerService.Make_Payment(request.user.sub, makePaymentDto);
  }

  @Post("/cash_out")
  @UseGuards(AuthGuard)
  async Cash_Out(@Request() request, @Body() cahsOutDto: CahsOutDto) {
    return await this.customerService.Cash_Out(request.user.sub, cahsOutDto);
  }

  @Post("/forgot_password")
  async Send_Email(@Body() phone: { user_phone: string }) {
    return await this.customerService.send_otp(phone.user_phone);
  }

  @Post("/change_password")
  async Change_Password(@Body() changePasswordDto: ChangePasswordDto) {
    return await this.customerService.Change_Password(changePasswordDto);
  }
}
