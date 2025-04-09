import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
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

  @ApiProperty({ example: 'add', description: 'Action to perform: add, remove, or update' })
  @IsNotEmpty({ message: 'Action is required' })
  @IsIn(['add', 'remove', 'update'], { message: 'Action must be either "add", "remove", or "update"' })
  @IsString({ message: 'Action must be a string' })
  action: 'add' | 'remove' | 'update';

  @ApiProperty({ example: 'LIKE', description: 'Type of the reaction (LIKE, LOVE, HAHA, etc.)' })
  @IsOptional()
  @IsString({ message: 'Reaction type must be a string' })
  reactionType?: string;
}
