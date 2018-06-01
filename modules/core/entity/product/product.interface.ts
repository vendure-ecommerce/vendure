import { LocaleString } from '../../locale/locale-types';
import { ProductVariant } from '../product-variant/product-variant.interface';

export interface Product {
    id: number;
    name: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    image: string;
    variants: ProductVariant[];
    createdAt: string;
    updatedAt: string;
}
