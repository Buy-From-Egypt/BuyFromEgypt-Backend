import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [SearchController],
  providers: [SearchService,PrismaService],
})
export class SearchModule {}
