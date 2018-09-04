import { Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateProductVariables,
    GenerateProductVariantsVariables,
    GetProductListVariables,
    GetProductWithVariantsVariables,
    UpdateProductVariantsVariables,
} from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { I18nError } from '../../i18n/i18n-error';
import { FacetValueService } from '../../service/facet-value.service';
import { ProductVariantService } from '../../service/product-variant.service';
import { ProductService } from '../../service/product.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';

@Resolver('Product')
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
    ) {}

    @Query('products')
    @ApplyIdCodec()
    async products(obj, args: GetProductListVariables): Promise<PaginatedList<Translated<Product>>> {
        return this.productService.findAll(args.languageCode, args.options || undefined);
    }

    @Query('product')
    @ApplyIdCodec()
    async product(obj, args: GetProductWithVariantsVariables): Promise<Translated<Product> | undefined> {
        return this.productService.findOne(args.id, args.languageCode || undefined);
    }

    @Mutation()
    @ApplyIdCodec()
    async createProduct(_, args: CreateProductVariables): Promise<Translated<Product>> {
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
    async generateVariantsForProduct(
        _,
        args: GenerateProductVariantsVariables,
    ): Promise<Translated<Product>> {
        const { productId, defaultPrice, defaultSku } = args;
        await this.productVariantService.generateVariantsForProduct(productId, defaultPrice, defaultSku);
        return assertFound(this.productService.findOne(productId, DEFAULT_LANGUAGE_CODE));
    }

    @Mutation()
    @ApplyIdCodec()
    async updateProductVariants(
        _,
        args: UpdateProductVariantsVariables,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return Promise.all(input.map(variant => this.productVariantService.update(variant)));
    }

    @Mutation()
    @ApplyIdCodec()
    async applyFacetValuesToProductVariants(_, args): Promise<Array<Translated<ProductVariant>>> {
        const { facetValueIds, productVariantIds } = args;
        const facetValues = await Promise.all(
            (facetValueIds as ID[]).map(async facetValueId => {
                const facetValue = await this.facetValueService.findOne(facetValueId, DEFAULT_LANGUAGE_CODE);
                if (!facetValue) {
                    throw new I18nError('error.entity-with-id-not-found', {
                        entityName: 'FacetValue',
                        id: facetValueId,
                    });
                }
                return facetValue;
            }),
        );

        return this.productVariantService.addFacetValues(productVariantIds, facetValues);
    }
}
