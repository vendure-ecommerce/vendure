import { LocaleString } from '../../locale/locale-types';
import { ProductVariant } from '../product-variant/product-variant.interface';
import { ProductOptionGroup } from '../product-option-group/product-option-group.interface';

export interface Product {
    id: number;
    name: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    image: string;
    optionGroups: ProductOptionGroup[];
    variants: ProductVariant[];
    createdAt: string;
    updatedAt: string;
}
