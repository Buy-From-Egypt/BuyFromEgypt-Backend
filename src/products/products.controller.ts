import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserTypeGuard } from '../common/guards/user-type.guard';
import { UserType } from '../common/decorators/user-type.decorator';
import { TypeEnum } from '../common/enums/user-type.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UserType(`${TypeEnum.IMPORTER}`)
  @UseGuards(AuthGuard, UserTypeGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  create(@UploadedFiles() files: Express.Multer.File[], @Req() req: Request & { user: { userId: string } }, @Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(req.user.userId, createProductDto, files);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(id, updateProductDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   return await this.productsService.remove(id);
  // }
}
