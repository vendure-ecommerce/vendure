import {
    AddItemInput,
    CurrencyCode,
    ModifyOrderInput,
    OrderDetailFragment,
    OrderLineInput,
} from '@vendure/admin-ui/core';
import { ProductSelectorItem } from '../components/order-editor/order-editor.component';

export interface OrderSnapshot {
    totalWithTax: number;
    currencyCode: CurrencyCode;
    couponCodes: string[];
    lines: OrderDetailFragment['lines'];
}

export interface AddedLine {
    id: string;
    featuredAsset?: ProductSelectorItem['productAsset'] | null;
    productVariant: {
        id: string;
        name: string;
        sku: string;
    };
    unitPrice: number;
    unitPriceWithTax: number;
    quantity: number;
}

export type ModifyOrderData = Omit<ModifyOrderInput, 'addItems' | 'adjustOrderLines'> & {
    addItems: Array<AddItemInput & { customFields?: any }>;
    adjustOrderLines: Array<OrderLineInput & { customFields?: any }>;
};
