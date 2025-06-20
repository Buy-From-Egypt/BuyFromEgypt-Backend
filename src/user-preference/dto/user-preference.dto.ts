import { IsArray, IsOptional, IsString, IsBoolean, IsNotEmpty, IsEmail } from 'class-validator';

export class UserPreferenceDto {
  @IsArray()
  @IsString({ each: true })
  industries: string[];

  @IsOptional()
  @IsString()
  supplierType?: string;

  @IsOptional()
  @IsString()
  orderQuantity?: string;

  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @IsOptional()
  @IsBoolean()
  receiveAlerts?: boolean;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
