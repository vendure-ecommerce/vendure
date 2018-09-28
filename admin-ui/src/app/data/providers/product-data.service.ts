import {
    AddOptionGroupToProduct,
    ApplyFacetValuesToProductVariants,
    CreateAssets,
    CreateProduct,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    GenerateProductVariants,
    GetAssetList,
    GetProductList,
    GetProductOptionGroups,
    GetProductWithVariants,
    RemoveOptionGroupFromProduct,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductVariantInput,
    UpdateProductVariants,
} from 'shared/generated-types';
import { pick } from 'shared/pick';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    APPLY_FACET_VALUE_TO_PRODUCT_VARIANTS,
    CREATE_ASSETS,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    GENERATE_PRODUCT_VARIANTS,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_WITH_VARIANTS,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from '../definitions/product-definitions';

import { BaseDataService } from './base-data.service';

export class ProductDataService {
    constructor(private baseDataService: BaseDataService) {}

    getProducts(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetProductList.Query, GetProductList.Variables>(GET_PRODUCT_LIST, {
            options: {
                take,
                skip,
            },
            languageCode: getDefaultLanguage(),
        });
    }

    getProduct(id: string) {
        return this.baseDataService.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
            GET_PRODUCT_WITH_VARIANTS,
            {
                id,
                languageCode: getDefaultLanguage(),
            },
        );
    }

    createProduct(product: CreateProductInput) {
        const input: CreateProduct.Variables = {
            input: pick(product, ['translations', 'customFields', 'assetIds', 'featuredAssetId']),
        };
        return this.baseDataService.mutate<CreateProduct.Mutation, CreateProduct.Variables>(
            CREATE_PRODUCT,
            input,
        );
    }

    updateProduct(product: UpdateProductInput) {
        const input: UpdateProduct.Variables = {
            input: pick(product, ['id', 'translations', 'customFields', 'assetIds', 'featuredAssetId']),
        };
        return this.baseDataService.mutate<UpdateProduct.Mutation, UpdateProduct.Variables>(
            UPDATE_PRODUCT,
            input,
        );
    }

    generateProductVariants(productId: string, defaultPrice?: number, defaultSku?: string) {
        return this.baseDataService.mutate<
            GenerateProductVariants.Mutation,
            GenerateProductVariants.Variables
        >(GENERATE_PRODUCT_VARIANTS, { productId, defaultPrice, defaultSku });
    }

    updateProductVariants(variants: UpdateProductVariantInput[]) {
        const input: UpdateProductVariants.Variables = {
            input: variants.map(pick(['id', 'translations', 'sku', 'price'])),
        };
        return this.baseDataService.mutate<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
            UPDATE_PRODUCT_VARIANTS,
            input,
        );
    }

    createProductOptionGroups(productOptionGroup: CreateProductOptionGroupInput) {
        const input: CreateProductOptionGroup.Variables = {
            input: productOptionGroup,
        };
        return this.baseDataService.mutate<
            CreateProductOptionGroup.Mutation,
            CreateProductOptionGroup.Variables
        >(CREATE_PRODUCT_OPTION_GROUP, input);
    }

    addOptionGroupToProduct(variables: AddOptionGroupToProduct.Variables) {
        return this.baseDataService.mutate<
            AddOptionGroupToProduct.Mutation,
            AddOptionGroupToProduct.Variables
        >(ADD_OPTION_GROUP_TO_PRODUCT, variables);
    }

    removeOptionGroupFromProduct(variables: RemoveOptionGroupFromProduct.Variables) {
        return this.baseDataService.mutate<
            RemoveOptionGroupFromProduct.Mutation,
            RemoveOptionGroupFromProduct.Variables
        >(REMOVE_OPTION_GROUP_FROM_PRODUCT, variables);
    }

    getProductOptionGroups(filterTerm?: string) {
        return this.baseDataService.query<GetProductOptionGroups.Query, GetProductOptionGroups.Variables>(
            GET_PRODUCT_OPTION_GROUPS,
            {
                filterTerm,
                languageCode: getDefaultLanguage(),
            },
        );
    }

    applyFacetValuesToProductVariants(facetValueIds: string[], productVariantIds: string[]) {
        return this.baseDataService.mutate<
            ApplyFacetValuesToProductVariants.Mutation,
            ApplyFacetValuesToProductVariants.Variables
        >(APPLY_FACET_VALUE_TO_PRODUCT_VARIANTS, {
            facetValueIds,
            productVariantIds,
        });
    }

    getAssetList(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetAssetList.Query, GetAssetList.Variables>(GET_ASSET_LIST, {
            options: {
                skip,
                take,
            },
        });
    }

    createAssets(files: File[]) {
        return this.baseDataService.mutate<CreateAssets.Mutation, CreateAssets.Variables>(CREATE_ASSETS, {
            input: files.map(file => ({ file })),
        });
    }
}
