import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from './token-blacklist/token-blacklist.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService
  ) {}

  extract_token_from_header(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extract_token_from_header(request);

    if (!token) {
      throw new UnauthorizedException("Token is empty");
    }

    if (await this.tokenBlacklistService.is_token_blacklisted(token)) {
      throw new UnauthorizedException("Token has been blacklisted");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }

    return true;
  }
}
