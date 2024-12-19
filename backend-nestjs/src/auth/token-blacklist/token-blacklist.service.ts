import { flatten, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from '../entities/auth.entity';

@Injectable()
export class TokenBlacklistService {
    constructor(
        @InjectRepository(SessionEntity)
        private readonly session_repo: Repository<SessionEntity>
    ) { }

    async get_token_data(token: string) {
        return await this.session_repo.findOne({
            where: {
                jwt_token: token
            }
        });
    }

    async is_token_blacklisted(token: string) {
        const _token = (await this.get_token_data(token));

        try {
            if (!_token) {
                throw new NotFoundException("Invalid token");
            }

            return (await this.get_token_data(token)).expiration_date < new Date();

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException('Failed to blacklist the token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async add_token_blacklist(phone: string, token: string) {
        const _token = (await this.session_repo.findOne({
            where:{
                user: { user_phone: phone },
                jwt_token: token
            }
        })).jwt_token;

        try {
            if (await this.is_token_blacklisted(_token)) {
                throw new UnauthorizedException("Token has already been blacklisted");
            }

            await this.session_repo.update({ jwt_token: _token }, { expiration_date: new Date() });

            return { message: "Token has been blacklisted" }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException('Failed to blacklist the token', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
