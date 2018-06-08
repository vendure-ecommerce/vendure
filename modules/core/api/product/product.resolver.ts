import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductDto } from '../../entity/product/create-product.dto';
import { Product } from '../../entity/product/product.interface';
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
    async createProduct(_, args: MutationInput<CreateProductDto>): Promise<Product> {
        const product = await this.productService.create(args.input);

        if (args.input.variants && args.input.variants.length) {
            for (const variant of args.input.variants) {
                await this.productVariantService.create(product, variant);
            }
        }

        return product;
    }
}

export interface MutationInput<T> {
    input: T;
}
