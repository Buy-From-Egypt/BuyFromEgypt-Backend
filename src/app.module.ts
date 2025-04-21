import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { PostLikesModule } from './post-likes/post-likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    ProductsModule,
    PostsModule,
    PostLikesModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  //  , { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule {}
