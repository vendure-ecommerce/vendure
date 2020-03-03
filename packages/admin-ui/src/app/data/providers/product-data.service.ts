import { pick } from '@vendure/common/lib/pick';

import {
    AddOptionGroupToProduct,
    AddOptionToGroup,
    AssignProductsToChannel,
    AssignProductsToChannelInput,
    CreateAssets,
    CreateProduct,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionInput,
    CreateProductVariantInput,
    CreateProductVariants,
    DeleteProduct,
    DeleteProductVariant,
    GetAsset,
    GetAssetList,
    GetProductList,
    GetProductOptionGroup,
    GetProductOptionGroups,
    GetProductVariantOptions,
    GetProductWithVariants,
    Reindex,
    RemoveOptionGroupFromProduct,
    RemoveProductsFromChannel,
    RemoveProductsFromChannelInput,
    SearchProducts,
    SortOrder,
    UpdateAsset,
    UpdateAssetInput,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductOption,
    UpdateProductOptionInput,
    UpdateProductVariantInput,
    UpdateProductVariants,
} from '../../common/generated-types';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    ADD_OPTION_TO_GROUP,
    ASSIGN_PRODUCTS_TO_CHANNEL,
    CREATE_ASSETS,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    CREATE_PRODUCT_VARIANTS,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    GET_ASSET,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUP,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_VARIANT_OPTIONS,
    GET_PRODUCT_WITH_VARIANTS,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    REMOVE_PRODUCTS_FROM_CHANNEL,
    SEARCH_PRODUCTS,
    UPDATE_ASSET,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_OPTION,
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
        });
    }

    getProduct(id: string) {
        return this.baseDataService.query<GetProductWithVariants.Query, GetProductWithVariants.Variables>(
            GET_PRODUCT_WITH_VARIANTS,
            {
                id,
            },
        );
    }

    getProductVariantsOptions(id: string) {
        return this.baseDataService.query<GetProductVariantOptions.Query, GetProductVariantOptions.Variables>(
            GET_PRODUCT_VARIANT_OPTIONS,
            {
                id,
            },
        );
    }

    getProductOptionGroup(id: string) {
        return this.baseDataService.query<GetProductOptionGroup.Query, GetProductOptionGroup.Variables>(
            GET_PRODUCT_OPTION_GROUP,
            {
                id,
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
                    'customFields',
                ]),
            ),
        };
        return this.baseDataService.mutate<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
            UPDATE_PRODUCT_VARIANTS,
            input,
        );
    }

    deleteProductVariant(id: string) {
        return this.baseDataService.mutate<DeleteProductVariant.Mutation, DeleteProductVariant.Variables>(
            DELETE_PRODUCT_VARIANT,
            {
                id,
            },
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

    addOptionToGroup(input: CreateProductOptionInput) {
        return this.baseDataService.mutate<AddOptionToGroup.Mutation, AddOptionToGroup.Variables>(
            ADD_OPTION_TO_GROUP,
            { input },
        );
    }

    removeOptionGroupFromProduct(variables: RemoveOptionGroupFromProduct.Variables) {
        return this.baseDataService.mutate<
            RemoveOptionGroupFromProduct.Mutation,
            RemoveOptionGroupFromProduct.Variables
        >(REMOVE_OPTION_GROUP_FROM_PRODUCT, variables);
    }

    updateProductOption(input: UpdateProductOptionInput) {
        return this.baseDataService.mutate<UpdateProductOption.Mutation, UpdateProductOption.Variables>(
            UPDATE_PRODUCT_OPTION,
            {
                input: pick(input, ['id', 'code', 'translations']),
            },
        );
    }

    getProductOptionGroups(filterTerm?: string) {
        return this.baseDataService.query<GetProductOptionGroups.Query, GetProductOptionGroups.Variables>(
            GET_PRODUCT_OPTION_GROUPS,
            {
                filterTerm,
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

    getAsset(id: string) {
        return this.baseDataService.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id,
        });
    }

    createAssets(files: File[]) {
        return this.baseDataService.mutate<CreateAssets.Mutation, CreateAssets.Variables>(CREATE_ASSETS, {
            input: files.map(file => ({ file })),
        });
    }

    updateAsset(input: UpdateAssetInput) {
        return this.baseDataService.mutate<UpdateAsset.Mutation, UpdateAsset.Variables>(UPDATE_ASSET, {
            input,
        });
    }

    assignProductsToChannel(input: AssignProductsToChannelInput) {
        return this.baseDataService.mutate<
            AssignProductsToChannel.Mutation,
            AssignProductsToChannel.Variables
        >(ASSIGN_PRODUCTS_TO_CHANNEL, {
            input,
        });
    }

    removeProductsFromChannel(input: RemoveProductsFromChannelInput) {
        return this.baseDataService.mutate<
            RemoveProductsFromChannel.Mutation,
            RemoveProductsFromChannel.Variables
        >(REMOVE_PRODUCTS_FROM_CHANNEL, {
            input,
        });
    }
}
