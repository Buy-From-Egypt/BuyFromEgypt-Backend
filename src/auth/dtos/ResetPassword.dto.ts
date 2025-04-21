import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Identifier (email or phone) of the user' })
  @IsString({message: 'Identifier must be a string'})
  @IsNotEmpty({message: 'Identifier is required'})
  identifier: string;

  @ApiProperty({ description: 'OTP code sent to the user' })
  @IsString({message: 'OTP code must be a string'})
  @IsNotEmpty({message: 'OTP code is required'})
  @MinLength(6, {message: 'OTP code must be at least 6 characters long'})
  otpCode: string;

  @ApiProperty({ description: 'New password for the user' })
  @IsString({message: 'New password must be a string'})
  @IsNotEmpty({message: 'New password is required'})
  @MinLength(8, {message: 'New password must be at least 8 characters long'})
  @IsString({message: 'New password must not contain spaces'})
  newPassword: string;
}
