import { TranslatedInput } from '../../locale/locale-types';

import { ProductOption } from './product-option.entity';

export interface CreateProductOptionDto extends TranslatedInput<ProductOption> {
    code?: string;
}
