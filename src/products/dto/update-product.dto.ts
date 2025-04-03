import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({ example: 'Product ID', description: 'ID of the product to update' })
  @IsOptional({ message: 'Product ID is optional' })
  @IsString()
  userId?: string;
}
