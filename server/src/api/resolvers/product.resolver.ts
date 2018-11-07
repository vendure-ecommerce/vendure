import { Args, Mutation, Parent, Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import {
    AddOptionGroupToProductMutationArgs,
    ApplyFacetValuesToProductVariantsMutationArgs,
    CreateProductMutationArgs,
    GenerateVariantsForProductMutationArgs,
    Permission,
    ProductQueryArgs,
    ProductsQueryArgs,
    RemoveOptionGroupFromProductMutationArgs,
    UpdateProductMutationArgs,
    UpdateProductVariantsMutationArgs,
} from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { I18nError } from '../../i18n/i18n-error';
import { FacetValueService } from '../../service/services/facet-value.service';
import { ProductVariantService } from '../../service/services/product-variant.service';
import { ProductService } from '../../service/services/product.service';
import { IdCodecService } from '../common/id-codec.service';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Decode } from '../decorators/decode.decorator';
import { Ctx } from '../decorators/request-context.decorator';

@Resolver('Product')
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
        private idCodecService: IdCodecService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.Public)
    async products(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductsQueryArgs,
    ): Promise<PaginatedList<Translated<Product>>> {
        return this.productService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.Public)
    async product(
        @Ctx() ctx: RequestContext,
        @Args() args: ProductQueryArgs,
    ): Promise<Translated<Product> | undefined> {
        return this.productService.findOne(ctx, args.id);
    }

    @ResolveProperty()
    async variants(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
    ): Promise<Array<Translated<ProductVariant>>> {
        const productId = this.idCodecService.decode(product.id);
        return this.productVariantService.getVariantsByProductId(ctx, productId);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('assetIds', 'featuredAssetId')
    async createProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateProductMutationArgs,
    ): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('assetIds', 'featuredAssetId')
    async updateProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateProductMutationArgs,
    ): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('productId', 'optionGroupId')
    async addOptionGroupToProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: AddOptionGroupToProductMutationArgs,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.addOptionGroupToProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('productId', 'optionGroupId')
    async removeOptionGroupFromProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: RemoveOptionGroupFromProductMutationArgs,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.removeOptionGroupFromProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('productId', 'defaultTaxCategoryId')
    async generateVariantsForProduct(
        @Ctx() ctx: RequestContext,
        @Args() args: GenerateVariantsForProductMutationArgs,
    ): Promise<Translated<Product>> {
        const { productId, defaultTaxCategoryId, defaultPrice, defaultSku } = args;
        await this.productVariantService.generateVariantsForProduct(
            ctx,
            productId,
            defaultTaxCategoryId,
            defaultPrice,
            defaultSku,
        );
        return assertFound(this.productService.findOne(ctx, productId));
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('taxCategoryId')
    async updateProductVariants(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateProductVariantsMutationArgs,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return Promise.all(input.map(variant => this.productVariantService.update(ctx, variant)));
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @Decode('facetValueIds', 'productVariantIds')
    async applyFacetValuesToProductVariants(
        @Ctx() ctx: RequestContext,
        @Args() args: ApplyFacetValuesToProductVariantsMutationArgs,
    ): Promise<Array<Translated<ProductVariant>>> {
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

        return this.productVariantService.addFacetValues(ctx, productVariantIds, facetValues);
    }
}
