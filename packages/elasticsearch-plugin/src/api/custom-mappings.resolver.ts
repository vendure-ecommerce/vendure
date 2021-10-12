import { Inject } from '@nestjs/common';
import { ResolveField, Resolver } from '@nestjs/graphql';
import { DeepRequired } from '@vendure/common/lib/shared-types';

import { ELASTIC_SEARCH_OPTIONS } from '../constants';
import { ElasticsearchOptions } from '../options';

/**
 * This resolver is only required if both customProductMappings and customProductVariantMappings are
 * defined, since this particular configuration will result in a union type for the
 * `SearchResult.customMappings` GraphQL field.
 */
@Resolver('CustomMappings')
export class CustomMappingsResolver {
    constructor(@Inject(ELASTIC_SEARCH_OPTIONS) private options: DeepRequired<ElasticsearchOptions>) {}

    @ResolveField()
    __resolveType(value: any): string {
        const productPropertyNames = Object.keys(this.options.customProductMappings);
        return Object.keys(value).every(k => productPropertyNames.includes(k))
            ? 'CustomProductMappings'
            : 'CustomProductVariantMappings';
    }
}
