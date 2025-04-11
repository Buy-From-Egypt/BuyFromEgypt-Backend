import { Controller, Get, Post, Body, Put, UseGuards, Req, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleEnum } from '@prisma/client';
import { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateUserForAdminDto } from './dto/update-userForAdmin.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('admin')
  @Roles(`${RoleEnum.ADMIN}`)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiBody({ type: CreateUserDto })
  @Post('admin')
  create(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async updateUser(@Req() req: Request & { user: { userId: string } }, @Body() updateUserDto: UpdateUserDto) {
    console.log(req.user.userId);
    return this.usersService.updateUser(req.user.userId, updateUserDto);
  }

  @Put('admin/:id')
  @Roles(`${RoleEnum.ADMIN}`)
  @UseGuards(AuthGuard, RolesGuard)
  async updateUserForAdmin(@Param('id') userId: string, @Body() updateUserForAdminDto: UpdateUserForAdminDto) {
    return this.usersService.updateUser(userId, updateUserForAdminDto);
  }

  @Delete('admin/:id')
  @Roles(`${RoleEnum.ADMIN}`)
  @UseGuards(AuthGuard, RolesGuard)
  async delete(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }

  @Put('admin/approveUser/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async approveUser(@Param('id') userId: string) {
    return this.usersService.toggleUserState(userId, 'approve');
  }

  @Put('admin/deactivateUser/:id')
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  async deactivateUser(@Param('id') userId: string) {
    return this.usersService.toggleUserState(userId, 'deactivate');
  }


}
