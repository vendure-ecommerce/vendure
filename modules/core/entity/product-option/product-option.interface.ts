import { LocaleString } from '../../locale/locale-types';
import { ProductOptionGroup } from '../product-option-group/product-option-group.interface';

export interface ProductOption {
    id: number;
    code: string;
    name: LocaleString;
    createdAt: string;
    updatedAt: string;
}
