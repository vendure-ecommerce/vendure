import { ID } from '../../../../shared/shared-types';
import { TranslatedInput } from '../../locale/locale-types';

import { FacetValue } from './facet-value.entity';

export interface CreateFacetValueDto extends TranslatedInput<FacetValue> {
    facetId: ID;
    code: string;
}

export interface UpdateFacetValueDto extends TranslatedInput<FacetValue> {
    id: ID;
    code: string;
}
