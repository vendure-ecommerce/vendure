import { Asset, GlobalFlag } from '@vendure/admin-ui/core';

export type TabName = 'details' | 'variants';

export interface VariantFormValue {
    id: string;
    enabled: boolean;
    sku: string;
    name: string;
    price: number;
    priceWithTax: number;
    taxCategoryId: string;
    stockOnHand: number;
    useGlobalOutOfStockThreshold: boolean;
    outOfStockThreshold: number;
    trackInventory: GlobalFlag;
    facetValueIds: string[];
    customFields?: any;
}

export interface SelectedAssets {
    assets?: Asset[];
    featuredAsset?: Asset;
}

export interface PaginationConfig {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
}
