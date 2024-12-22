import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePersonalAccountDto, SignupDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { And, Repository } from 'typeorm';
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
    private readonly merchant_repo: Repository<MerchantEntity>
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

  async user_data(id: number = -1, phone: string = "-1") {
    const in_user_repo = await this.user_repo.findOne({
      where:[
        { user_id: id },
        { user_phone: phone }
      ]
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
    return await this.user_data(id);
    // try {
    //   // Try to find the customer by user_id
    //   const get_user = await this.user_repo.findOneBy({ user_id: id });

    //   // If no customer found, throw a NotFoundException
    //   if (!get_user) {
    //     throw new NotFoundException('User not found');
    //   }

    //   const { user_password, ...userWithoutPassword } = get_user;

    //   // Return the user without the password field
    //   return userWithoutPassword;
    // } catch (error) {
    //   if (error instanceof NotFoundException) {
    //     // Don't catch NotFoundException as it's handled already
    //     throw error;
    //   }

    //   throw new InternalServerErrorException('An error occurred while fetching the user profile');
    // }
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
      const sender_new_balance = sender_data.account.account_balance - sendMoneyDto.transaction_amount;
      const receiver_new_balance = receiver_account.account_balance + sendMoneyDto.transaction_amount;

      await this.account_repo.update({ user_id: sender_data.account.user_id }, { account_balance: sender_new_balance });
      await this.account_repo.update({ user_id: receiver_account.user_id }, { account_balance: receiver_new_balance });

      var new_transaction: TransactionEntity = new TransactionEntity();

      new_transaction.sender_phone = (await this.user_repo.findOneBy({ user_id: sender_data.user_id })).user_phone;
      new_transaction.receiver_phone = receiver_data.user_phone;
      new_transaction.transaction_amount = sendMoneyDto.transaction_amount;
      new_transaction.transaction_type = TransactionType.Payment;
      new_transaction.transaction_amount = sendMoneyDto.transaction_amount;
      new_transaction.trnsaction_time = new Date();
      new_transaction.account = sender_data.account;

      await this.trnsaction_repo.save(new_transaction);

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
      throw new HttpException("Insufficient fund", HttpStatus.BAD_REQUEST)
    }

    const user_new_balance = user_data.in_customer_repo.account.account_balance - payment_data.payment_amount;
    const merchant_new_balance = merchant_data.in_customer_repo.account.account_balance + payment_data.payment_amount;

    await this.account_repo.update({ user_id: id }, { account_balance: user_new_balance });
    await this. account_repo.update( { user_id: payment_data.payment_to }, { account_balance: merchant_new_balance } );
    await this.payment_repo.update({ payment_token: payment_data.payment_token }, { payment_status: "paid" });

    var new_transaction: TransactionEntity = new TransactionEntity();

    new_transaction.sender_phone = user_data.in_user_repo.user_phone;
    new_transaction.receiver_phone = merchant_data.in_user_repo.user_phone;
    new_transaction.transaction_type = TransactionType.Send_Money;
    new_transaction.transaction_amount = payment_data.payment_amount;
    new_transaction.trnsaction_time = new Date();
    new_transaction.account = user_data.in_customer_repo.account;
    await this.trnsaction_repo.save(new_transaction);

    throw new HttpException("Payment success", HttpStatus.OK)
  }

  async charge_calculate(amount: number) {
  }

  async Cash_Out(id: number) {
    const user_data = await this.user_data(id);

    if (!user_data.in_user_repo) {
      throw new NotFoundException("User not found");
    }
  }
}
