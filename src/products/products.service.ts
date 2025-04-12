import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import slugify from 'slugify';
import * as process from 'node:process';
import { CloudinaryService } from '../common/modules/cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private cloudinaryService: CloudinaryService
  ) {}

  findAll() {
    return this.prisma.product.findMany({ include: { owner: true } });
  }

  async createProduct(userId: string, createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<Product> {
    //do check category
    const user = await this.prisma.user.findFirst({ where: { userId } });
    if (!user) throw new NotFoundException(`User with this ID not found.`);
    const slug = slugify(createProductDto.name);
    const existedProduct = await this.prisma.product.findFirst({ where: { slug } });
    if (existedProduct)   throw new ConflictException(`A product with the name "${createProductDto.name}" already exists.`);
    const folder = `${process.env.SITE_NAME}/products/${slugify(createProductDto.name)}`;
    const uploadedImages = await this.cloudinaryService.uploadImages(files, folder);
    console.log(uploadedImages);
    const newProduct = await this.prisma.product.create({
      data: {
        ...createProductDto,
        slug,
        ownerId: userId,
        images: {
          create: uploadedImages.map((img: any, index: number) => ({
            url: img.url,
            publicId: img.publicId,
            isPrimary: index === 0,
          })),
        },
      },
      include: { owner: true, images: true },
    });
    return newProduct;
  }

  findProductById(productId: string) {
    const product = this.prisma.product.findUnique({ where: { productId }, include: { owner: true } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    return product;
  }



  //
  //   async update(id: string, updateProductDto: UpdateProductDto) {
  //     const data = {
  //       ...updateProductDto,
  //       images: updateProductDto.images
  //         ? {
  //             upsert: updateProductDto.images.map((image) => ({
  //               where: { id: image.id },
  //               update: { url: image.url },
  //               create: { url: image.url, productId: id },
  //             })),
  //           }
  //         : undefined,
  //     };
  //     return this.prisma.product.update({
  //       where: { id },
  //       data,
  //     });
  //   }
  //
  //   async remove(id: string) {
  //     const product = await this.prisma.product.findUnique({
  //       where: { id: id.toString() },
  //     });
  //     if (!product) {
  //       throw new NotFoundException(`product with ID ${id} not found`);
  //     }
  //     try {
  //       await this.prisma.productImage.deleteMany({
  //         where: { productId: id.toString() },
  //       });
  //       await this.prisma.product.delete({
  //         where: { id: id.toString() },
  //       });
  //       return { message: 'Product deleted successfully' };
  //     } catch (error) {
  //       if (error.code === 'P2003') {
  //         throw new BadRequestException('Cannot delete product due to existing references.');
  //       }
  //       throw error;
  //     }
  //   }
}
