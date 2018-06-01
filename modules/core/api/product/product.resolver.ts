import { Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from '../../entity/product/product.interface';

@Resolver('Product')
export class ProductResolver {
    constructor(private productService: ProductService) {}

    @Query('products')
    products(obj, args): Promise<Product[]> {
        return this.productService.findAll(args.lang);
    }

    @Query('product')
    product(obj, args): Promise<Product> {
        return this.productService.findOne(args.id, args.lang);
    }
}
