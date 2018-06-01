import { LocaleString } from '../../locale/locale-types';

export class ProductVariant {
    id: number;
    sku: string;
    name: LocaleString;
    image: string;
    price: string;
    createdAt: string;
    updatedAt: string;
}
