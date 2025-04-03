import { ProductImage } from './productImage.entity';

export class Product {
  productId: string;
  name: string;
  description?: string;
  price: number;
  currencyCode: string;
  categoryId?: string;
  userId: string;
  approvedById?: string;
  createdAt: Date;
  updatedAt: Date;

  images: ProductImage[];
}
