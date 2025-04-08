import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostLikeDto {
  @ApiProperty({ example: 'post-id-123', description: 'ID of the liked post' })
  @IsNotEmpty({ message: 'Post ID is required' })
  @IsString({ message: 'Post ID must be a string' })
  postId: string;

  @ApiProperty({ example: 'user-id-456', description: 'ID of the user who liked the post' })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @ApiProperty({ example: 'add', description: 'Action to perform: add or remove' })
  @IsNotEmpty({ message: 'Action is required' })
  @IsIn(['add', 'remove'], { message: 'Action must be either "add" or "remove"' })
  @IsString({ message: 'Action must be a string' })
  action: 'add' | 'remove';
}