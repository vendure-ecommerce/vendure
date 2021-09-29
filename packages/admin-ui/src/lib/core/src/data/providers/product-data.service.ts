import { pick } from '@vendure/common/lib/pick';

import {
    AddOptionGroupToProduct,
    AddOptionToGroup,
    AssignProductsToChannel,
    AssignProductsToChannelInput,
    AssignProductVariantsToChannelInput,
    AssignVariantsToChannel,
    CreateAssets,
    CreateProduct,
    CreateProductInput,
    CreateProductOptionGroup,
    CreateProductOptionGroupInput,
    CreateProductOptionInput,
    CreateProductVariantInput,
    CreateProductVariants,
    CreateTag,
    CreateTagInput,
    DeleteAssets,
    DeleteProduct,
    DeleteProductVariant,
    DeleteTag,
    GetAsset,
    GetAssetList,
    GetProductList,
    GetProductOptionGroup,
    GetProductOptionGroups,
    GetProductSimple,
    GetProductVariant,
    GetProductVariantList,
    GetProductVariantOptions,
    GetProductWithVariants,
    GetTag,
    GetTagList,
    ProductListOptions,
    ProductSelectorSearch,
    ProductVariantListOptions,
    Reindex,
    RemoveOptionGroupFromProduct,
    RemoveProductsFromChannel,
    RemoveProductsFromChannelInput,
    RemoveProductVariantsFromChannelInput,
    RemoveVariantsFromChannel,
    SearchProducts,
    SortOrder,
    TagListOptions,
    UpdateAsset,
    UpdateAssetInput,
    UpdateProduct,
    UpdateProductInput,
    UpdateProductOption,
    UpdateProductOptionGroup,
    UpdateProductOptionGroupInput,
    UpdateProductOptionInput,
    UpdateProductVariantInput,
    UpdateProductVariants,
    UpdateTag,
    UpdateTagInput,
} from '../../common/generated-types';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    ADD_OPTION_TO_GROUP,
    ASSIGN_PRODUCTS_TO_CHANNEL,
    ASSIGN_VARIANTS_TO_CHANNEL,
    CREATE_ASSETS,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    CREATE_PRODUCT_VARIANTS,
    CREATE_TAG,
    DELETE_ASSETS,
    DELETE_PRODUCT,
    DELETE_PRODUCT_VARIANT,
    DELETE_TAG,
    GET_ASSET,
    GET_ASSET_LIST,
    GET_PRODUCT_LIST,
    GET_PRODUCT_OPTION_GROUP,
    GET_PRODUCT_OPTION_GROUPS,
    GET_PRODUCT_SIMPLE,
    GET_PRODUCT_VARIANT,
    GET_PRODUCT_VARIANT_LIST,
    GET_PRODUCT_VARIANT_OPTIONS,
    GET_PRODUCT_WITH_VARIANTS,
    GET_TAG,
    GET_TAG_LIST,
    PRODUCT_SELECTOR_SEARCH,
    REMOVE_OPTION_GROUP_FROM_PRODUCT,
    REMOVE_PRODUCTS_FROM_CHANNEL,
    REMOVE_VARIANTS_FROM_CHANNEL,
    SEARCH_PRODUCTS,
    UPDATE_ASSET,
    UPDATE_PRODUCT,
    UPDATE_PRODUCT_OPTION,
    UPDATE_PRODUCT_OPTION_GROUP,
    UPDATE_PRODUCT_VARIANTS,
    UPDATE_TAG,
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

    productSelectorSearch(term: string, take: number) {
        return this.baseDataService.query<ProductSelectorSearch.Query, ProductSelectorSearch.Variables>(
            PRODUCT_SELECTOR_SEARCH,
            {
                take,
                term,
            },
        );
    }

    reindex() {
        return this.baseDataService.mutate<Reindex.Mutation>(REINDEX);
    }

    getProducts(options: ProductListOptions) {
        return this.baseDataService.query<GetProductList.Query, GetProductList.Variables>(GET_PRODUCT_LIST, {
            options,
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

    getProductSimple(id: string) {
        return this.baseDataService.query<GetProductSimple.Query, GetProductSimple.Variables>(
            GET_PRODUCT_SIMPLE,
            {
                id,
            },
        );
    }

    getProductVariants(options: ProductVariantListOptions) {
        return this.baseDataService.query<GetProductVariantList.Query, GetProductVariantList.Variables>(
            GET_PRODUCT_VARIANT_LIST,
            { options },
        );
    }

    getProductVariant(id: string) {
        return this.baseDataService.query<GetProductVariant.Query, GetProductVariant.Variables>(
            GET_PRODUCT_VARIANT,
            { id },
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
                'enabled',
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
                    'outOfStockThreshold',
                    'useGlobalOutOfStockThreshold',
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
                input: pick(input, ['id', 'code', 'translations', 'customFields']),
            },
        );
    }

    updateProductOptionGroup(input: UpdateProductOptionGroupInput) {
        return this.baseDataService.mutate<
            UpdateProductOptionGroup.Mutation,
            UpdateProductOptionGroup.Variables
        >(UPDATE_PRODUCT_OPTION_GROUP, {
            input: pick(input, ['id', 'code', 'translations', 'customFields']),
        });
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

    deleteAssets(ids: string[], force: boolean) {
        return this.baseDataService.mutate<DeleteAssets.Mutation, DeleteAssets.Variables>(DELETE_ASSETS, {
            input: {
                assetIds: ids,
                force,
            },
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

    assignVariantsToChannel(input: AssignProductVariantsToChannelInput) {
        return this.baseDataService.mutate<
            AssignVariantsToChannel.Mutation,
            AssignVariantsToChannel.Variables
        >(ASSIGN_VARIANTS_TO_CHANNEL, {
            input,
        });
    }

    removeVariantsFromChannel(input: RemoveProductVariantsFromChannelInput) {
        return this.baseDataService.mutate<
            RemoveVariantsFromChannel.Mutation,
            RemoveVariantsFromChannel.Variables
        >(REMOVE_VARIANTS_FROM_CHANNEL, {
            input,
        });
    }

    getTag(id: string) {
        return this.baseDataService.query<GetTag.Query, GetTag.Variables>(GET_TAG, { id });
    }

    getTagList(options?: TagListOptions) {
        return this.baseDataService.query<GetTagList.Query, GetTagList.Variables>(GET_TAG_LIST, { options });
    }

    createTag(input: CreateTagInput) {
        return this.baseDataService.mutate<CreateTag.Mutation, CreateTag.Variables>(CREATE_TAG, { input });
    }

    updateTag(input: UpdateTagInput) {
        return this.baseDataService.mutate<UpdateTag.Mutation, UpdateTag.Variables>(UPDATE_TAG, { input });
    }

    deleteTag(id: string) {
        return this.baseDataService.mutate<DeleteTag.Mutation, DeleteTag.Variables>(DELETE_TAG, { id });
    }
}
