import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginatedList } from '../../common/common-types';
import { Product } from '../../entity/product/product.entity';
import { ProductVariantService } from '../../service/product-variant.service';
import { ProductService } from '../../service/product.service';

@Resolver('Product')
export class ProductResolver {
    constructor(private productService: ProductService, private productVariantService: ProductVariantService) {}

    @Query('products')
    products(obj, args): Promise<PaginatedList<Product>> {
        return this.productService.findAll(args.languageCode, args.take, args.skip);
    }

    @Query('product')
    product(obj, args): Promise<Product | undefined> {
        return this.productService.findOne(args.id, args.languageCode);
    }

    @Mutation()
    async createProduct(_, args): Promise<Product> {
        const { input } = args;
        const product = await this.productService.create(input);

        if (input.variants && input.variants.length) {
            for (const variant of input.variants) {
                await this.productVariantService.create(product, variant);
            }
        }

        return product;
    }

    @Mutation()
    updateProduct(_, args): Promise<Product | undefined> {
        const { input } = args;
        return this.productService.update(input);
    }
}
