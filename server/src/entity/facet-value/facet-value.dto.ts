import { TranslatedInput } from '../../locale/locale-types';

import { FacetValue } from './facet-value.entity';

export interface CreateFacetValueDto extends TranslatedInput<FacetValue> {
    code: string;
}
