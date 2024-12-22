import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePersonalAccountDto, SignupDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { And, EntityManager, MoreThan, Repository } from 'typeorm';
import { CreateAccontDto } from './dto/create-account.dto';
import { AccountEntity } from './entities/account.entity';
import { CustomerEntity } from './entities/customer.entity';
import { AccountType } from './constraints/account-type.constraint';
import { SendMoneyDto } from './dto/send-money.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionType } from './constraints/transaction-type.contraint';
import { MakePaymentDto } from './dto/make-payment.dto';
import { PaymentEntity } from './entities/payment.entity';
import { MerchantEntity } from './entities/merchant.entity';
import { randomInt } from 'crypto';
import { MailService } from './mail/mail.service';
import { OtpEntity } from './entities/otp.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CahsOutDto } from './dto/cash-out.dto';
import { AgentEntity } from './entities/agent.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user_repo: Repository<UserEntity>,

    @InjectRepository(CustomerEntity)
    private readonly customer_repo: Repository<CustomerEntity>,

    @InjectRepository(AccountEntity)
    private readonly account_repo: Repository<AccountEntity>,

    @InjectRepository(TransactionEntity)
    private readonly trnsaction_repo: Repository<TransactionEntity>,

    @InjectRepository(PaymentEntity)
    private readonly payment_repo: Repository<PaymentEntity>,

    @InjectRepository(MerchantEntity)
    private readonly merchant_repo: Repository<MerchantEntity>,

    @InjectRepository(OtpEntity)
    private readonly otp_repo: Repository<OtpEntity>,

    @InjectRepository(AgentEntity)
    private readonly agent_repo: Repository<AgentEntity>,

    private readonly mailService: MailService,
    
    private readonly entityManager: EntityManager
  ) {}

  async Signup(signupDto: SignupDto): Promise<{ message: string }> {
    try {
      // Check if the user already exists
      const existing_user = await this.user_repo.findOneBy([
        { user_phone: signupDto.user_phone },
        { user_email: signupDto.user_email }
      ]);

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

  async Create_Personal_Account(id: number, createPersonalAccountDto: CreatePersonalAccountDto) {
    if (!createPersonalAccountDto) {
      throw new NotFoundException(HttpStatus.BAD_GATEWAY, "Missing required data");
    }

    const existing_user = await this.user_repo.findOne({
      where: { user_id: id }
    });

    if (!existing_user) {
      throw new NotFoundException(HttpStatus.NOT_FOUND, 'User not found');
    }

    const existing_customer = await this.customer_repo.findOne({
      where: {
        user_id: id
      }
    });

    if (existing_customer) {
      throw new HttpException('Account already exist', HttpStatus.CONFLICT);
    }

    var new_customer: CustomerEntity = new CustomerEntity();

    new_customer = createPersonalAccountDto;
    new_customer.user_id = id;

    var { account, ...customer } = new_customer;

    var new_account: AccountEntity = new_customer.account; 
    new_account.user_id = id;
    new_account.account_balance = 0;
    new_account.account_type = AccountType.personal;
    new_account.account_creation_time = new Date();
    new_account.transactions = [];

    console.log(account, customer);

    await this.account_repo.save(account);
    await this.customer_repo.save(customer);

    return { message: "Customer created" }
  }

  async user_data(id: number = -1, phone: string = "-1", email: string = "") {
    const in_user_repo = await this.user_repo.findOne({
      where:[
        { user_id: id !== -1 ? id : undefined },
        { user_phone: phone !== "-1" ? phone : undefined },
        { user_email: email !== "" ? email : undefined }
      ],
      // select: ["user_id", "user_name", "user_phone", "user_email", "user_role"]
    });

    const in_customer_repo = await this.customer_repo.findOne({
      where: [
        { user_id: id }
      ],
      relations: ["account"]
    });

    return {
      in_user_repo,
      in_customer_repo
    }
  }

  async Profile(id: number) {
    const user = await this.user_data(id);
    const { in_user_repo: { user_password, ...without_password }, in_customer_repo } = user;

    return { in_user_repo: without_password, in_customer_repo };
  }

  async Send_Money(sender_id: number, sendMoneyDto: SendMoneyDto) {
    const sender_data = await this.customer_repo.findOne({
      where: [
        { user_id: sender_id }
      ],
      relations: [ "account" ]
    });

    if (sender_data.account.account_balance < sendMoneyDto.transaction_amount) {
      throw new HttpException("Insufficient fund", HttpStatus.BAD_REQUEST)
    }

    const receiver_data = await this.user_repo.findOne({
      where: [
        { user_phone: sendMoneyDto.receiver_phone }
      ]
    });

    if (!receiver_data) {
      throw new NotFoundException("Invalid receiver data");
    }

    const receiver_account = await this.account_repo.findOne({
      where: [
        { user_id: receiver_data.user_id }
      ]
    });

    if (!receiver_account) {
      throw new NotFoundException("Invalid receiver account");
    } else if (receiver_account.account_type != AccountType.personal) {
      throw new HttpException("Account must be personal", HttpStatus.BAD_REQUEST);
    } else if (sender_data.user_id == receiver_data.user_id) {
      throw new HttpException("Cannot transfer fund to own account", HttpStatus.BAD_REQUEST)
    } else {
      await this.entityManager.transaction(async (manager) => {
        const sender_new_balance = sender_data.account.account_balance - sendMoneyDto.transaction_amount;
        const receiver_new_balance = receiver_account.account_balance + sendMoneyDto.transaction_amount;
    
        await manager.update(AccountEntity, { user_id: sender_data.account.user_id }, { account_balance: sender_new_balance });
        await manager.update(AccountEntity, { user_id: receiver_data.user_id }, { account_balance: receiver_new_balance });
    
        const new_transaction = new TransactionEntity();
        new_transaction.sender_phone = (await this.user_repo.findOneBy({ user_id: sender_data.user_id })).user_phone;
        new_transaction.receiver_phone = receiver_data.user_phone;
        new_transaction.transaction_amount = sendMoneyDto.transaction_amount;
        new_transaction.transaction_type = TransactionType.Send_Money;
        new_transaction.transaction_time = new Date();
        new_transaction.account = sender_data.account;
    
        await manager.save(TransactionEntity, new_transaction);
      });

      throw new HttpException("Send money success", HttpStatus.OK);
    }
  }

  async Make_Payment(id: number, makePaymentDto: MakePaymentDto) {
    const user_data = await this.user_data(id);
    const payment_data = await this.payment_repo.findOne({
      where: [
        { payment_token: makePaymentDto.payment_token }
      ]
    });

    if (!payment_data) {
      throw new NotFoundException("Payment data not found");
    }

    if (payment_data.payment_status != "pending") {
      throw new HttpException("Payment has already been made", HttpStatus.CONFLICT)
    }

    const merchant_data = await this.user_data(payment_data.payment_to);

    if (user_data.in_customer_repo.account.account_balance < payment_data.payment_amount) {
      throw new HttpException("Insufficient fund", HttpStatus.BAD_REQUEST);
    }

    await this.entityManager.transaction(async (manager) => {
      const user_new_balance = user_data.in_customer_repo.account.account_balance - payment_data.payment_amount;
      const merchant_new_balance = merchant_data.in_customer_repo.account.account_balance + payment_data.payment_amount;
  
      await manager.update(AccountEntity, { user_id: id }, { account_balance: user_new_balance });
      await manager.update(AccountEntity, { user_id: payment_data.payment_to }, { account_balance: merchant_new_balance });
      await manager.update(PaymentEntity, { payment_token: payment_data.payment_token }, { payment_status: "paid" });

      var new_transaction: TransactionEntity = new TransactionEntity();

      new_transaction.sender_phone = user_data.in_user_repo.user_phone;
      new_transaction.receiver_phone = merchant_data.in_user_repo.user_phone;
      new_transaction.transaction_type = TransactionType.Payment;
      new_transaction.transaction_amount = payment_data.payment_amount;
      new_transaction.transaction_time = new Date();
      new_transaction.account = user_data.in_customer_repo.account;
      await manager.save(TransactionEntity ,new_transaction);

    });

    // throw new HttpException("Payment success", HttpStatus.OK);
    return {
      message: "Payment success",
      payment_token: payment_data.payment_token,
      payment_for: payment_data.payment_for,
      payment_to: merchant_data.in_user_repo.user_name,
      payment_amount: payment_data.payment_amount,
      payment_status: "paid"
    }
  }

  async Cash_Out(id: number, cahsOutDto: CahsOutDto) {
    const user_data = await this.user_data(id);

    if (user_data.in_customer_repo.account.account_balance < cahsOutDto.transaction_amount) {
      throw new HttpException("Insufficient fund", HttpStatus.BAD_REQUEST);
    }

    const agent = (await this.user_data(-1, cahsOutDto.receiver_phone)).in_user_repo;

    if (!agent) {
      throw new NotFoundException("Agent not found");
    }

    const agent_data = await this.user_data(agent.user_id);

    if(agent_data.in_customer_repo.account.account_type != AccountType.agent) {
      throw new BadRequestException("Cash out is not possible to this account");
    }

    await this.entityManager.transaction(async (manager) => {
      user_data.in_customer_repo.account.account_balance -= cahsOutDto.transaction_amount;
      await manager.save(user_data.in_customer_repo.account);

      agent_data.in_customer_repo.account.account_balance += cahsOutDto.transaction_amount;
      await manager.save(agent_data.in_customer_repo.account);

      var new_transaction: TransactionEntity = new TransactionEntity();
      new_transaction.sender_phone = user_data.in_user_repo.user_phone;
      new_transaction.receiver_phone = agent_data.in_user_repo.user_phone;
      new_transaction.transaction_type = TransactionType.Cash_Out;
      new_transaction.transaction_amount = cahsOutDto.transaction_amount;
      new_transaction.transaction_time = new Date();
      new_transaction.account = user_data.in_customer_repo.account;

      await manager.save(TransactionEntity, new_transaction);

    });

    return {
     message: "Cash out success",
      to: {
        agent_name: agent_data.in_user_repo.user_name,
        agent_phone: agent_data.in_user_repo.user_phone
      }
    }
  }

  async send_otp(phone: string) {
    const user = await this.user_data(-1, phone);
    
    if(!user.in_user_repo) {
      throw new NotFoundException("User not found");
    }

    const opt = randomInt(100000, 1000000).toString();

    const new_otp: OtpEntity = new OtpEntity();
    new_otp.user_email = user.in_user_repo.user_email;
    new_otp.otp = opt;
    new_otp.generation_time = new Date()
    new_otp.expiration_time = new Date(new Date().getTime() + 10 * 60 * 1000);
    await this.otp_repo.save(new_otp);
    await this.mailService.Send_OTP(user.in_user_repo.user_email, opt);

    return { email: user.in_user_repo.user_email, Otp: new_otp.otp };
  }

  async Change_Password(changePasswordDto: ChangePasswordDto) {
    const otp_data = await this.otp_repo.findOne({
      where: {
          otp: changePasswordDto.otp,
          user_email: changePasswordDto.user_email,
          expiration_time: MoreThan(new Date())
        },
        order: {
          expiration_time: "DESC"
        }
    });

    if (!otp_data) {
      throw new NotFoundException("Otp not found or expired");
    }

    if (changePasswordDto.new_password !== changePasswordDto.confirm_password) {
      throw new BadRequestException("New password and confirm password did not match");
    }

    const user = await this.user_data(-1, "", changePasswordDto.user_email);
    user.in_user_repo.user_password = await bcrypt.hash(changePasswordDto.new_password, 10);

    otp_data.expiration_time = new Date();

    await this.user_repo.save(user.in_user_repo);

    await this.otp_repo.save(otp_data);

    return {
      message: 'Password changed successfully',
      user_email: user.in_user_repo.user_email
    }
  }
}
