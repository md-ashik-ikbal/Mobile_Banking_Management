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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      AccountEntity,
      TransactionEntity
    ]),
    JwtModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
