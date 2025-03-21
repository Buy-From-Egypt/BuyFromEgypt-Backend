import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  create(@Body() data:any) {
    console.log(data);
    // return this.usersService.create(data);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
