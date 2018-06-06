import { LocaleString } from '../../locale/locale-types';
import { ProductOptionGroup } from '../product-option-group/product-option-group.interface';
import { ProductVariant } from '../product-variant/product-variant.interface';

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
