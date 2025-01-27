import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CustomerEntity } from './entities/customer.entity';
import { AccountEntity } from './entities/account.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { JwtModule } from '@nestjs/jwt';
import { TokenBlacklistService } from 'src/auth/token-blacklist/token-blacklist.service';
import { SessionEntity } from 'src/auth/entities/auth.entity';
import { PaymentEntity } from './entities/payment.entity';
import { MerchantEntity } from './entities/merchant.entity';
import { MailService } from './mail/mail.service';
import { OtpEntity } from './entities/otp.entity';
import { AgentEntity } from './entities/agent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      AccountEntity,
      TransactionEntity,
      SessionEntity,
      PaymentEntity,
      MerchantEntity,
      AgentEntity,
      OtpEntity
    ]),
    JwtModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService, TokenBlacklistService, MailService],
})
export class CustomerModule {}
