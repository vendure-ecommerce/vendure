import { pick } from 'shared/pick';

import {
    AddOptionGroupToProduct,
    CreateAssets,
    CreateProduct,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductVariantInput,
    CreateProductVariants,
    DeleteProduct,
    GetAssetList,
    GetProductList,
    GetProductOptionGroups,
    GetProductWithVariants,
    Reindex,
    RemoveOptionGroupFromProduct,
    SearchProducts,
    SortOrder,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductVariantInput,
    UpdateProductVariants,
} from '../../common/generated-types';
import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_ASSETS,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    CREATE_PRODUCT_VARIANTS,
    DELETE_PRODUCT,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_WITH_VARIANTS,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    SEARCH_PRODUCTS,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from '../definitions/product-definitions';
import { REINDEX } from '../definitions/settings-definitions';

import { BaseDataService } from './base-data.service';

export class ProductDataService {
    constructor(private baseDataService: BaseDataService) {}

    searchProducts(term: string, take: number = 10, skip: number = 0) {
        return this.baseDataService.query<SearchProducts.Query, SearchProducts.Variables>(SEARCH_PRODUCTS, {
            input: {
                term,
                take,
                skip,
                groupByProduct: true,
            },
        });
    }

    reindex() {
        return this.baseDataService.mutate<Reindex.Mutation>(REINDEX);
    }

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
            input: pick(product, [
                'translations',
                'customFields',
                'assetIds',
                'featuredAssetId',
                'facetValueIds',
            ]),
        };
        return this.baseDataService.mutate<CreateProduct.Mutation, CreateProduct.Variables>(
            CREATE_PRODUCT,
            input,
        );
    }

    updateProduct(product: UpdateProductInput) {
        const input: UpdateProduct.Variables = {
            input: pick(product, [
                'id',
                'enabled',
                'translations',
                'customFields',
                'assetIds',
                'featuredAssetId',
                'facetValueIds',
            ]),
        };
        return this.baseDataService.mutate<UpdateProduct.Mutation, UpdateProduct.Variables>(
            UPDATE_PRODUCT,
            input,
        );
    }

    deleteProduct(id: string) {
        return this.baseDataService.mutate<DeleteProduct.Mutation, DeleteProduct.Variables>(DELETE_PRODUCT, {
            id,
        });
    }

    createProductVariants(input: CreateProductVariantInput[]) {
        return this.baseDataService.mutate<CreateProductVariants.Mutation, CreateProductVariants.Variables>(
            CREATE_PRODUCT_VARIANTS,
            {
                input,
            },
        );
    }

    updateProductVariants(variants: UpdateProductVariantInput[]) {
        const input: UpdateProductVariants.Variables = {
            input: variants.map(
                pick([
                    'id',
                    'enabled',
                    'translations',
                    'sku',
                    'price',
                    'taxCategoryId',
                    'facetValueIds',
                    'featuredAssetId',
                    'assetIds',
                    'trackInventory',
                    'stockOnHand',
                ]),
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
                sort: {
                    createdAt: SortOrder.DESC,
                },
            },
        });
    }

    createAssets(files: File[]) {
        return this.baseDataService.mutate<CreateAssets.Mutation, CreateAssets.Variables>(CREATE_ASSETS, {
            input: files.map(file => ({ file })),
        });
    }
}
