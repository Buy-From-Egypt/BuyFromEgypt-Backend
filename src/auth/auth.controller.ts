import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/Register.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dtos/Login.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'User successfully registered' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ user: User; token: string }> {
    return this.authService.login(loginDto);
  }
}
