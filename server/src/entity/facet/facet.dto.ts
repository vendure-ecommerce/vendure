import { TranslatedInput } from '../../locale/locale-types';
import { CreateFacetValueDto } from '../facet-value/facet-value.dto';

import { Facet } from './facet.entity';

export interface CreateFacetDto extends TranslatedInput<Facet> {
    code: string;
    values?: CreateFacetValueDto[];
}

export interface UpdateFacetDto extends TranslatedInput<Facet> {
    id: string;
    code?: string;
}
