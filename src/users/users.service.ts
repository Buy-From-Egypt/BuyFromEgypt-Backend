import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  //
  // async create(data: { email?: string; name?: string }): Promise<User> {
  //   console.log(data);
  //   const newUser = this.prisma.user.create({ data? });
  //   return newUser;
  // }

  async findAll() {
    return this.prisma.user.findMany();
  }
}

