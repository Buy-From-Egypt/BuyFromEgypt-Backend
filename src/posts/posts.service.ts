import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    const { images, productIds, ...postData } = createPostDto;
    return this.prisma.post.create({
      data: {
        ...postData,
        images: { create: (images ?? []).map((url) => ({ url })) }, // Adjusted to match PostImage relation
        products: {
          connect: productIds?.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: { comments: true, likes: true },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: id.toString() }, // Corrected field name
      include: { comments: true, likes: true },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async remove(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: id.toString() }, // Corrected field name
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return this.prisma.post.delete({
      where: { id: id.toString() },
    });
  }
}
