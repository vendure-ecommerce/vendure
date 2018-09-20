import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AddOptionGroupToProductVariables,
    ApplyFacetValuesToProductVariantsVariables,
    CreateProductVariables,
    GenerateProductVariantsVariables,
    GetProductListVariables,
    GetProductWithVariantsVariables,
    Permission,
    RemoveOptionGroupFromProductVariables,
    UpdateProductVariables,
    UpdateProductVariantsVariables,
} from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Translated } from '../../common/types/locale-types';
import { assertFound } from '../../common/utils';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { I18nError } from '../../i18n/i18n-error';
import { FacetValueService } from '../../service/providers/facet-value.service';
import { ProductVariantService } from '../../service/providers/product-variant.service';
import { ProductService } from '../../service/providers/product.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';
import { RequestContext } from '../common/request-context';
import { RequestContextPipe } from '../common/request-context.pipe';
import { Allow } from '../common/roles-guard';

@Resolver('Product')
export class ProductResolver {
    constructor(
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    @ApplyIdCodec()
    async products(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: GetProductListVariables,
    ): Promise<PaginatedList<Translated<Product>>> {
        ctx.setLanguageCode(args.languageCode);
        return this.productService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    @ApplyIdCodec()
    async product(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: GetProductWithVariantsVariables,
    ): Promise<Translated<Product> | undefined> {
        ctx.setLanguageCode(args.languageCode);
        return this.productService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @ApplyIdCodec()
    async createProduct(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: CreateProductVariables,
    ): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.create(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @ApplyIdCodec()
    async updateProduct(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: UpdateProductVariables,
    ): Promise<Translated<Product>> {
        const { input } = args;
        return this.productService.update(ctx, input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @ApplyIdCodec(['productId', 'optionGroupId'])
    async addOptionGroupToProduct(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: AddOptionGroupToProductVariables,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.addOptionGroupToProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @ApplyIdCodec(['productId', 'optionGroupId'])
    async removeOptionGroupFromProduct(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: RemoveOptionGroupFromProductVariables,
    ): Promise<Translated<Product>> {
        const { productId, optionGroupId } = args;
        return this.productService.removeOptionGroupFromProduct(ctx, productId, optionGroupId);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @ApplyIdCodec()
    async generateVariantsForProduct(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: GenerateProductVariantsVariables,
    ): Promise<Translated<Product>> {
        const { productId, defaultPrice, defaultSku } = args;
        await this.productVariantService.generateVariantsForProduct(ctx, productId, defaultPrice, defaultSku);
        return assertFound(this.productService.findOne(ctx, productId));
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @ApplyIdCodec()
    async updateProductVariants(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: UpdateProductVariantsVariables,
    ): Promise<Array<Translated<ProductVariant>>> {
        const { input } = args;
        return Promise.all(input.map(variant => this.productVariantService.update(variant)));
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    @ApplyIdCodec()
    async applyFacetValuesToProductVariants(
        @Context(RequestContextPipe) ctx: RequestContext,
        @Args() args: ApplyFacetValuesToProductVariantsVariables,
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

        return this.productVariantService.addFacetValues(productVariantIds, facetValues);
    }
}
