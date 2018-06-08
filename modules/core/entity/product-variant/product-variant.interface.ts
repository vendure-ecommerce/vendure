import { LocaleString } from '../../locale/locale-types';
import { ProductOption } from '../product-option/product-option.interface';

export class ProductVariant {
    id: number;
    sku: string;
    name: LocaleString;
    image: string;
    price: number;
    options: ProductOption[];
    createdAt: string;
    updatedAt: string;
}
