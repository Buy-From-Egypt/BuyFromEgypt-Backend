import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserPreferenceDto } from './dto/user-preference.dto';

@Injectable()
export class UserPreferenceService {
  constructor(private prisma: PrismaService) {}

  async upsertPreference(dto: UserPreferenceDto) {
    const user = await this.prisma.user.findFirst({ where: { email: dto.email }, select: { userId: true } });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.userPreference.upsert({
      where: { userId: user.userId },
      update: { ...dto },
      create: { userId: user.userId, ...dto },
    });
  }

  async getMyPreference(userId: string) {
    return this.prisma.userPreference.findUnique({
      where: { userId },
    });
  }
}
