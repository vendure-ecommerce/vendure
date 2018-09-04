import { ID } from 'shared/shared-types';

import { TranslatedInput } from '../../common/types/locale-types';

import { ProductVariant } from './product-variant.entity';

export interface CreateProductVariantDto extends TranslatedInput<ProductVariant> {
    sku: string;
    price: number;
    image?: string;
    optionCodes?: string[];
}
