import { ProductImage } from './productImage.entity';
import { User } from '../../users/entities/user.entity';

export class Product {
  productId: string;
  name: string;
  slug?: string;
  description?: string | null;
  price: number;
  currencyCode: string;
  active: boolean;
  rating?: number | null;
  reviewCount: number;
  owner?: User;
  // category?: Category;
  // approvedBy?: User;
  // approvedAt?: Date;
  // certifications: Certification[];
  // orders: Order[];
  // posts: Post[];
  images?: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
}
