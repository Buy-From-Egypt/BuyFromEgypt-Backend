import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';

@Injectable()
export class PostLikesService {
  constructor(private prisma: PrismaService) {}

  async create(createPostLikeDto: CreatePostLikeDto) {
    const { postId, userId, action } = createPostLikeDto;

    if (action === 'add') {
      return this.prisma.postLike.create({
        data: { postId, userId },
      });
    } else if (action === 'remove') {
      return this.prisma.postLike.deleteMany({
        where: { postId, userId },
      });
    } else {
      throw new Error('Invalid action');
    }
  }

  async findAll() {
    return this.prisma.postLike.findMany();
  }

  async remove(id: number) {
    return this.prisma.postLike.delete({
      where: { id: id.toString() },
    });
  }
}
