import { Inject } from '@nestjs/common';
import { ResolveField, Resolver } from '@nestjs/graphql';
import { DeepRequired } from '@vendure/common/lib/shared-types';

import { ELASTIC_SEARCH_OPTIONS } from '../constants';
import { ElasticsearchOptions } from '../options';

/**
 * This resolver is only required if scriptFields are defined for both products and product variants.
 * This particular configuration will result in a union type for the
 * `SearchResult.customScriptFields` GraphQL field.
 */
@Resolver('CustomScriptFields')
export class CustomScriptFieldsResolver {
    constructor(@Inject(ELASTIC_SEARCH_OPTIONS) private options: DeepRequired<ElasticsearchOptions>) {}

    @ResolveField()
    __resolveType(value: any): string {
        const productScriptFields = Object.entries(this.options.searchConfig?.scriptFields || {})
            .filter(([, scriptField]) => scriptField.context !== 'variant')
            .map(([k]) => k);
        return Object.keys(value).every(k => productScriptFields.includes(k))
            ? 'CustomProductScriptFields'
            : 'CustomProductVariantScriptFields';
    }
}
