import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { CreatePostLikeDto } from './dto/create-post-like.dto';

@Controller('post-likes')
export class PostLikesController {
  constructor(private readonly postLikesService: PostLikesService) {}

  @Post()
  create(@Body() createPostLikeDto: CreatePostLikeDto) {
    return this.postLikesService.create(createPostLikeDto);
  }

  @Get()
  findAll() {
    return this.postLikesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postLikesService.remove(+id);
  }
}
