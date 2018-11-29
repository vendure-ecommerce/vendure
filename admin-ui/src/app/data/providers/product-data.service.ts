import { forkJoin, from } from 'rxjs';
import { bufferCount, concatMap, mergeMap } from 'rxjs/operators';
import {
    AddOptionGroupToProduct,
    CreateAssets,
    CreateProduct,
    CreateProductCategory,
    CreateProductCategoryInput,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    GenerateProductVariants,
    GetAssetList,
    GetProductCategory,
    GetProductCategoryList,
    GetProductList,
    GetProductOptionGroups,
    GetProductWithVariants,
    MoveProductCategory,
    MoveProductCategoryInput,
    RemoveOptionGroupFromProduct,
    UpdateProduct,
    UpdateProductCategory,
    UpdateProductCategoryInput,
    UpdateProductInput,
    UpdateProductVariantInput,
    UpdateProductVariants,
} from 'shared/generated-types';
import { pick } from 'shared/pick';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_ASSETS,
    CREATE_PRODUCT,
    CREATE_PRODUCT_CATEGORY,
    CREATE_PRODUCT_OPTION_GROUP,
    GENERATE_PRODUCT_VARIANTS,
    GET_ASSET_LIST,
    GET_PRODUCT_CATEGORY,
    GET_PRODUCT_CATEGORY_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_WITH_VARIANTS,
    MOVE_PRODUCT_CATEGORY,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_CATEGORY,
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
            input: variants.map(
                pick(['id', 'translations', 'sku', 'price', 'taxCategoryId', 'facetValueIds']),
            ),
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

    getProductCategories(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetProductCategoryList.Query, GetProductCategoryList.Variables>(
            GET_PRODUCT_CATEGORY_LIST,
            {
                options: {
                    take,
                    skip,
                },
                languageCode: getDefaultLanguage(),
            },
        );
    }

    getProductCategory(id: string) {
        return this.baseDataService.query<GetProductCategory.Query, GetProductCategory.Variables>(
            GET_PRODUCT_CATEGORY,
            {
                id,
                languageCode: getDefaultLanguage(),
            },
        );
    }

    createProductCategory(input: CreateProductCategoryInput) {
        return this.baseDataService.mutate<CreateProductCategory.Mutation, CreateProductCategory.Variables>(
            CREATE_PRODUCT_CATEGORY,
            {
                input: pick(input, [
                    'translations',
                    'assetIds',
                    'featuredAssetId',
                    'facetValueIds',
                    'customFields',
                ]),
            },
        );
    }

    updateProductCategory(input: UpdateProductCategoryInput) {
        return this.baseDataService.mutate<UpdateProductCategory.Mutation, UpdateProductCategory.Variables>(
            UPDATE_PRODUCT_CATEGORY,
            {
                input: pick(input, [
                    'id',
                    'translations',
                    'assetIds',
                    'featuredAssetId',
                    'facetValueIds',
                    'customFields',
                ]),
            },
        );
    }

    moveProductCategory(inputs: MoveProductCategoryInput[]) {
        return from(inputs).pipe(
            concatMap(input =>
                this.baseDataService.mutate<MoveProductCategory.Mutation, MoveProductCategory.Variables>(
                    MOVE_PRODUCT_CATEGORY,
                    { input },
                ),
            ),
            bufferCount(inputs.length),
        );
    }
}
