import { ProductOptionGroup } from '../product-option-group/product-option-group.interface';
import { LocaleString } from '../../locale/locale-types';

export interface ProductOption {
    id: number;
    code: string;
    name: LocaleString;
    createdAt: string;
    updatedAt: string;
}
