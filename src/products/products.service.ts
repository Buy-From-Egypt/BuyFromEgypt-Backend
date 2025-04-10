import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const data = {
      ...createProductDto,
      images: createProductDto.images
        ? {
            create: createProductDto.images.map((image) => ({
              url: image.url,
              productId: image.productId,
            })),
          }
        : undefined,
    };
    return this.prisma.product.create({ data });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const data = {
      ...updateProductDto,
      images: updateProductDto.images
        ? {
            upsert: updateProductDto.images.map((image) => ({
              where: { id: image.id },
              update: { url: image.url },
              create: { url: image.url, productId: id },
            })),
          }
        : undefined,
    };
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: id.toString() },
    });
    if (!product) {
      throw new NotFoundException(`product with ID ${id} not found`);
    }
    try {
      await this.prisma.productImage.deleteMany({
        where: { productId: id.toString() },
      });
      await this.prisma.product.delete({
        where: { id: id.toString() },
      });
      return { message: 'Product deleted successfully' };
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Cannot delete product due to existing references.');
      }
      throw error;
    }
  }
}
