import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CustomerEntity } from './entities/customer.entity';
import { AccountEntity } from './entities/account.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { TokenBlacklistService } from 'src/auth/token-blacklist/token-blacklist.service';
import { SessionEntity } from 'src/auth/entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      AccountEntity,
      TransactionEntity,
      SessionEntity
    ]),
    JwtModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService, TokenBlacklistService],
})
export class CustomerModule {}
