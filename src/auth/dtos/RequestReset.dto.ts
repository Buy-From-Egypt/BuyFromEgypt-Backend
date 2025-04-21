import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RequestResetDto {
  @ApiProperty({ description: 'Identifier (email or phone) of the user' })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}
