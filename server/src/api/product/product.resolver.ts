import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { PaginatedList } from '../../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { assertFound } from '../../common/utils';
import { UpdateProductVariantDto } from '../../entity/product-variant/create-product-variant.dto';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { Translated } from '../../locale/locale-types';
import { ProductVariantService } from '../../service/product-variant.service';
import { ProductService } from '../../service/product.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';

@Resolver('Product')
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
    ) {}

    @Query('products')
    @ApplyIdCodec()
    async products(obj, args): Promise<PaginatedList<Translated<Product>>> {
        return this.productService.findAll(args.languageCode, args.options);
    }

    @Query('product')
    @ApplyIdCodec()
    async product(obj, args): Promise<Translated<Product> | undefined> {
        return this.productService.findOne(args.id, args.languageCode);
    }

    @Mutation()
    @ApplyIdCodec()
    async createProduct(_, args): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.create(input);
    }

    @Mutation()
    @ApplyIdCodec()
    async updateProduct(_, args): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.update(input);
    }

    @Mutation()
    @ApplyIdCodec(['productId', 'optionGroupId'])
    async addOptionGroupToProduct(_, args): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.addOptionGroupToProduct(productId, optionGroupId);
    }

    @Mutation()
    @ApplyIdCodec(['productId', 'optionGroupId'])
    async removeOptionGroupFromProduct(_, args): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.removeOptionGroupFromProduct(productId, optionGroupId);
    }

    @Mutation()
    @ApplyIdCodec()
    async generateVariantsForProduct(_, args): Promise<Translated<Product>> {
        const { productId, defaultPrice, defaultSku } = args;
        await this.productVariantService.generateVariantsForProduct(productId, defaultPrice, defaultSku);
        return assertFound(this.productService.findOne(productId, DEFAULT_LANGUAGE_CODE));
    }

    @Mutation()
    @ApplyIdCodec()
    async updateProductVariants(_, args): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args as { input: UpdateProductVariantDto[] };
        return Promise.all(input.map(variant => this.productVariantService.update(variant)));
    }
}
