import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { Request } from 'express';
import { jwtConstants } from '../../common/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token not found. Please log in.');
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret });
    } catch (error) {
      if (error.name === 'TokenExpiredError') throw new UnauthorizedException('Token expired. Please log in again.');
      else throw new UnauthorizedException('Authentication failed.');
    }
    const user = await this.prisma.user.findFirst({ where: { userId: payload.userId } });
    if (!user) throw new UnauthorizedException('User not found');
    request['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
