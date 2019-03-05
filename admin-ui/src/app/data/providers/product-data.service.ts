import { from } from 'rxjs';
import { bufferCount, concatMap } from 'rxjs/operators';
import {
    AddOptionGroupToProduct,
    CreateAssets,
    CreateCollection,
    CreateCollectionInput,
    CreateProduct,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    DeleteProduct,
    GenerateProductVariants,
    GetAssetList,
    GetCollection,
    GetCollectionFilters,
    GetCollectionList,
    GetProductList,
    GetProductOptionGroups,
    GetProductWithVariants,
    MoveCollection,
    MoveCollectionInput,
    RemoveOptionGroupFromProduct,
    SearchProducts,
    UpdateCollection,
    UpdateCollectionInput,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductVariantInput,
    UpdateProductVariants,
} from 'shared/generated-types';
import { pick } from 'shared/pick';

import { getDefaultLanguage } from '../../common/utilities/get-default-language';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_ASSETS,
    CREATE_COLLECTION,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    DELETE_PRODUCT,
    GENERATE_PRODUCT_VARIANTS,
    GET_ASSET_LIST,
    GET_COLLECTION,
    GET_COLLECTION_FILTERS,
    GET_COLLECTION_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_WITH_VARIANTS,
    MOVE_COLLECTION,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    SEARCH_PRODUCTS,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_VARIANTS,
} from '../definitions/product-definitions';

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

    generateProductVariants(productId: string, defaultPrice?: number, defaultSku?: string) {
        return this.baseDataService.mutate<
            GenerateProductVariants.Mutation,
            GenerateProductVariants.Variables
        >(GENERATE_PRODUCT_VARIANTS, { productId, defaultPrice, defaultSku });
    }

    updateProductVariants(variants: UpdateProductVariantInput[]) {
        const input: UpdateProductVariants.Variables = {
            input: variants.map(
                pick([
                    'id',
                    'translations',
                    'sku',
                    'price',
                    'taxCategoryId',
                    'facetValueIds',
                    'featuredAssetId',
                    'assetIds',
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
            },
        });
    }

    createAssets(files: File[]) {
        return this.baseDataService.mutate<CreateAssets.Mutation, CreateAssets.Variables>(CREATE_ASSETS, {
            input: files.map(file => ({ file })),
        });
    }

    getCollectionFilters() {
        return this.baseDataService.query<GetCollectionFilters.Query>(GET_COLLECTION_FILTERS);
    }

    getCollections(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetCollectionList.Query, GetCollectionList.Variables>(
            GET_COLLECTION_LIST,
            {
                options: {
                    take,
                    skip,
                },
                languageCode: getDefaultLanguage(),
            },
        );
    }

    getCollection(id: string) {
        return this.baseDataService.query<GetCollection.Query, GetCollection.Variables>(GET_COLLECTION, {
            id,
            languageCode: getDefaultLanguage(),
        });
    }

    createCollection(input: CreateCollectionInput) {
        return this.baseDataService.mutate<CreateCollection.Mutation, CreateCollection.Variables>(
            CREATE_COLLECTION,
            {
                input: pick(input, [
                    'translations',
                    'assetIds',
                    'featuredAssetId',
                    'filters',
                    'customFields',
                ]),
            },
        );
    }

    updateCollection(input: UpdateCollectionInput) {
        return this.baseDataService.mutate<UpdateCollection.Mutation, UpdateCollection.Variables>(
            UPDATE_COLLECTION,
            {
                input: pick(input, [
                    'id',
                    'translations',
                    'assetIds',
                    'featuredAssetId',
                    'filters',
                    'customFields',
                ]),
            },
        );
    }

    moveCollection(inputs: MoveCollectionInput[]) {
        return from(inputs).pipe(
            concatMap(input =>
                this.baseDataService.mutate<MoveCollection.Mutation, MoveCollection.Variables>(
                    MOVE_COLLECTION,
                    { input },
                ),
            ),
            bufferCount(inputs.length),
        );
    }
}
