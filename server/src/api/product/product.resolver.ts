import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginatedList } from '../../../../shared/shared-types';
import { Product } from '../../entity/product/product.entity';
import { IdCodecService } from '../../service/id-codec.service';
import { ProductVariantService } from '../../service/product-variant.service';
import { ProductService } from '../../service/product.service';

@Resolver('Product')
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private idCodecService: IdCodecService,
        private productVariantService: ProductVariantService,
    ) {}

    @Query('products')
    async products(obj, args): Promise<PaginatedList<Product>> {
        return this.productService
            .findAll(args.languageCode, args.take, args.skip)
            .then(list => this.idCodecService.encode(list));
    }

    @Query('product')
    async product(obj, args): Promise<Product | undefined> {
        return this.productService
            .findOne(this.idCodecService.decode(args).id, args.languageCode)
            .then(p => this.idCodecService.encode(p));
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

        return this.idCodecService.encode(product);
    }

    @Mutation()
    async updateProduct(_, args): Promise<Product | undefined> {
        const { input } = args;
        const product = await this.productService.update(this.idCodecService.decode(input));
        return this.idCodecService.decode(product);
    }

    @Mutation()
    async addOptionGroupToProduct(_, args): Promise<Product | undefined> {
        const { productId, optionGroupId } = args;
        const product = await this.productService.addOptionGroupToProduct(productId, optionGroupId);
        return this.idCodecService.decode(product);
    }
}
