import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ description: 'Identifier (email or phone) of the user' })
  @ApiProperty({ description: 'OTP code sent to the user' })
  @IsString({message: 'Identifier must be a string'})
  @IsNotEmpty({message: 'Identifier is required'})
  identifier: string;

  @ApiProperty({ description: 'OTP code sent to the user' })
  @IsString({message: 'OTP code must be a string'})
  @IsNotEmpty({message: 'OTP code is required'})
  @IsString({message: 'OTP code must be at least 6 characters long'})
  otpCode: string;
}
