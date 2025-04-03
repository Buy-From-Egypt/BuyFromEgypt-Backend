import { IsNotEmpty, IsOptional, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductImage } from '../entities/productImage.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Product Description', description: 'Description of the product' })
  @IsOptional({ message: 'Product description is optional' })
  @IsString()
  description?: string;

  @ApiProperty({ example: 100, description: 'Price of the product' })
  @IsNotEmpty({ message: 'Product price is required' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'EGP', description: 'Currency code of the product price' })
  @IsNotEmpty({ message: 'Currency code is required' })
  @IsString()
  currencyCode: string;

  @ApiProperty({ example: 'Category ID', description: 'ID of the product category' })
  @IsOptional({ message: 'Category ID is optional' })
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: 'User ID', description: 'ID of the user creating the product' })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString()
  userId: string;

  @ApiProperty({ type: [ProductImage], description: 'List of product images' })
  @IsOptional({ message: 'Product images are optional' })
  @ValidateNested({ each: true })
  @Type(() => ProductImage)
  images?: ProductImage[];
}
