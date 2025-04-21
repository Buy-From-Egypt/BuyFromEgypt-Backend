import { Injectable, UnauthorizedException } from '@nestjs/common';

import { RegisterDto } from './dtos/Register.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { LoginDto } from './dtos/Login.dto';
import { JwtService } from '@nestjs/jwt';
import { RequestResetDto } from './dtos/RequestReset.dto';
import { VerifyOtpDto } from './dtos/VerifyOTP.dto';
import { ResetPasswordDto } from './dtos/ResetPassword.dto';
import { MailService } from 'src/MailService/mail.service';
import { MobileService } from 'src/MobileService/mobile.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private mobileService: MobileService
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; message: string }> {
    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email: registerDto.email }, { phoneNumber: registerDto.phoneNumber }, { taxId: registerDto.taxId }] },
      select: { email: true, phoneNumber: true, taxId: true },
    });

    if (existingUser) {
      throw new UnauthorizedException(
        existingUser.email === registerDto.email || existingUser.phoneNumber === registerDto.phoneNumber ? 'Email Or Phone number is already exists' : 'Tax ID is already exists'
      );
    }

    const hashedPassword: string = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return {
      message: 'Your account has been successfully created and is currently under review. You will be notified once the verification process is complete.',
      user: newUser,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.prisma.user.findFirst({ where: { email: loginDto.email } });

    if (!user) throw new UnauthorizedException('The email address is not registered.');
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('The Email Or Password you entered is incorrect.');

    if (!user.active) throw new ForbiddenException("Account under review. You'll be notified upon verification.");

    const payload = { userId: user.userId, email: user.email, active: user.active, role: user.role, type: user.type };

    const token = await this.jwtService.signAsync(payload);

    return { user, token };
  }

  async requestReset(requestResetDto: RequestResetDto): Promise<{ message: string }> {
    const { identifier } = requestResetDto;

    if (!identifier) {
      throw new UnauthorizedException('Identifier is required.');
    }

    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phoneNumber: identifier }] },
    });

    if (!user) throw new UnauthorizedException('User not found.');

    const otpCode = crypto.randomBytes(3).toString('hex');
    console.log('OTP Code:', otpCode);

    await this.prisma.otp.create({
      data: {
        userId: user.userId,
        otpCode,
        identifier,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
      },
    });

    if (identifier.includes('@')) {
      await this.mailService.sendOtpEmail(user.email, otpCode); // Use Email OTP
    } else {
      await this.mobileService.sendOtpSms(identifier, otpCode); // Use SMS OTP
    }

    return { message: 'OTP sent successfully.' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const { identifier, otpCode } = verifyOtpDto;

    const otpRecord = await this.prisma.otp.findFirst({
      where: { identifier, otpCode },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) throw new UnauthorizedException('Invalid OTP.');
    if (new Date() > otpRecord.expiresAt) throw new UnauthorizedException('OTP has expired.');

    return { message: 'OTP verified successfully.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { identifier, otpCode, newPassword } = resetPasswordDto;

    if (!newPassword || newPassword.length < 8) {
      throw new UnauthorizedException('Password must be at least 8 characters long.');
    }
    if (newPassword.includes(' ')) {
      throw new UnauthorizedException('Password cannot contain spaces.');
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new UnauthorizedException('Password must contain at least one letter, one number, and one special character.');
    }

    const otpRecord = await this.prisma.otp.findFirst({
      where: { identifier, otpCode },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) throw new UnauthorizedException('Invalid OTP code. Please request a new one.');
    if (new Date() > otpRecord.expiresAt) throw new UnauthorizedException('OTP has expired. Please request a new one.');

    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { phoneNumber: identifier }] },
    });

    if (!user) throw new UnauthorizedException('User not found. Please try again.');

    const hashedPassword: string = await bcrypt.hash(newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { userId: user.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.otp.delete({
        where: { id: otpRecord.id },
      }),
    ]);

    return { message: 'Password has been reset successfully. You can now login with your new password.' };
  }
}
