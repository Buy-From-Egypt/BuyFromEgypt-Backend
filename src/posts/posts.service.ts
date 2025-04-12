// import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
// import { PrismaService } from '../../prisma/prisma.service';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
//
// @Injectable()
// export class PostsService {
//   constructor(private prisma: PrismaService) {}
//
//   async create(createPostDto: CreatePostDto) {
//     const { images, productIds, ...postData } = createPostDto;
//     return this.prisma.post.create({
//       data: {
//         ...postData,
//         images: { create: (images ?? []).map((url) => ({ url })) },
//         products: {
//           connect: productIds?.map((id) => ({ id })),
//         },
//       },
//     });
//   }
//
//   async findAll() {
//     return this.prisma.post.findMany({
//       include: { comments: true, likes: true },
//     });
//   }
//
//   async findOne(id: string) {
//     const post = await this.prisma.post.findUnique({
//       where: { id: id.toString() },
//       include: { comments: true, likes: true },
//     });
//     if (!post) {
//       throw new NotFoundException(`Post with ID ${id} not found`);
//     }
//     return post;
//   }
//
//   async update(id: string, updatePostDto: UpdatePostDto) {
//     const post = await this.prisma.post.findUnique({
//       where: { id: id.toString() },
//     });
//     if (!post) {
//       throw new NotFoundException(`Post with ID ${id} not found`);
//     }
//     const { images, productIds, ...postData } = updatePostDto;
//     return this.prisma.post.update({
//       where: { id: id.toString() },
//       data: {
//         ...postData,
//         images: images ? { deleteMany: {}, create: images.map((url) => ({ url })) } : undefined,
//         products: productIds ? { set: productIds.map((id) => ({ id })) } : undefined,
//       },
//     });
//   }
//
//   async remove(id: string) {
//     const post = await this.prisma.post.findUnique({
//       where: { id: id.toString() },
//     });
//     if (!post) {
//       throw new NotFoundException(`Post with ID ${id} not found`);
//     }
//     try {
//       // Delete associated comments, likes, and post images
//       await this.prisma.comment.deleteMany({
//         where: { postId: id.toString() },
//       });
//       await this.prisma.postLike.deleteMany({
//         where: { postId: id.toString() },
//       });
//       await this.prisma.postImage.deleteMany({
//         where: { postId: id.toString() },
//       });
//       await this.prisma.product.deleteMany({
//         where: { posts: { some: { id: id.toString() } } },
//       });
//       return this.prisma.post.delete({
//         where: { id: id.toString() },
//       });
//     } catch (error) {
//       if (error.code === 'P2003') {
//         throw new BadRequestException('Cannot delete post due to existing references.');
//       }
//       throw error;
//     }
//   }
// }
