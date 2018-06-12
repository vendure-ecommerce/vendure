import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductDto } from '../../entity/product/product.dto';
import { Product } from '../../entity/product/product.entity';
import { ProductVariantService } from '../../service/product-variant.service';
import { ProductService } from '../../service/product.service';

@Resolver('Product')
export class ProductResolver {
    constructor(private productService: ProductService, private productVariantService: ProductVariantService) {}

    @Query('products')
    products(obj, args): Promise<Product[]> {
        return this.productService.findAll(args.lang);
    }

    @Query('product')
    product(obj, args): Promise<Product | undefined> {
        return this.productService.findOne(args.id, args.lang);
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
    updateProduct(_, args): Promise<Product> {
        const { productId, input } = args;
        return this.productService.update(input);
    }
}

export interface MutationInput<T> {
    input: T;
}
