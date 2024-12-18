import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/customer/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { SessionEntity } from './entities/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity
    ]),
    JwtModule.registerAsync({
      useFactory: async () => (
        {
          secret: process.env.JWT_SECRET,
        }
      )
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
