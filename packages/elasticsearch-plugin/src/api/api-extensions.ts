import { gql } from 'graphql-tag';
import { DocumentNode } from 'graphql';

import { ElasticsearchOptions } from '../options';

export function generateSchemaExtensions(options: ElasticsearchOptions): DocumentNode {
    const customMappingTypes = generateCustomMappingTypes(options);
    const inputExtensions = Object.entries(options.extendSearchInputType || {});
    const sortExtensions = options.extendSearchSortType || [];

    const sortExtensionGql = `
    extend input SearchResultSortParameter {
        ${sortExtensions.map(key => `${key}: SortOrder`).join('\n            ')}
    }`;

    return gql`
        extend type SearchResponse {
            prices: SearchResponsePriceData!
        }

        extend type SearchResult {
            inStock: Boolean
        }

        type SearchResponsePriceData {
            range: PriceRange!
            rangeWithTax: PriceRange!
            buckets: [PriceRangeBucket!]!
            bucketsWithTax: [PriceRangeBucket!]!
        }

        type PriceRangeBucket {
            to: Int!
            count: Int!
        }

        extend input SearchInput {
            priceRange: PriceRangeInput
            priceRangeWithTax: PriceRangeInput
            inStock: Boolean
            ${inputExtensions.map(([name, type]) => `${name}: ${type}`).join('\n            ')}
        }

        ${sortExtensions.length > 0 ? sortExtensionGql : ''}

        input PriceRangeInput {
            min: Int!
            max: Int!
        }

        ${customMappingTypes ? customMappingTypes : ''}
    `;
}

function generateCustomMappingTypes(options: ElasticsearchOptions): DocumentNode | undefined {
    const productMappings = Object.entries(options.customProductMappings || {}).filter(
        ([, value]) => value.public ?? true,
    );
    const variantMappings = Object.entries(options.customProductVariantMappings || {}).filter(
        ([, value]) => value.public ?? true,
    );
    const searchInputTypeExtensions = Object.entries(options.extendSearchInputType || {});
    const scriptProductFields = Object.entries(options.searchConfig?.scriptFields || {}).filter(
        ([, scriptField]) => scriptField.context !== 'variant',
    );
    const scriptVariantFields = Object.entries(options.searchConfig?.scriptFields || {}).filter(
        ([, scriptField]) => scriptField.context !== 'product',
    );
    let sdl = '';

    if (scriptProductFields.length || scriptVariantFields.length) {
        if (scriptProductFields.length) {
            sdl += `
            type CustomProductScriptFields {
                ${scriptProductFields.map(([name, def]) => `${name}: ${def.graphQlType}`).join('\n')}
            }
            `;
        }
        if (scriptVariantFields.length) {
            sdl += `
            type CustomProductVariantScriptFields {
                ${scriptVariantFields.map(([name, def]) => `${name}: ${def.graphQlType}`).join('\n')}
            }
            `;
        }
        if (scriptProductFields.length && scriptVariantFields.length) {
            sdl += `
                union CustomScriptFields = CustomProductScriptFields | CustomProductVariantScriptFields

                extend type SearchResult {
                    customScriptFields: CustomScriptFields!
                }
            `;
        } else if (scriptProductFields.length) {
            sdl += `
                extend type SearchResult {
                    customScriptFields: CustomProductScriptFields!
                }
            `;
        } else if (scriptVariantFields.length) {
            sdl += `
                extend type SearchResult {
                    customScriptFields: CustomProductVariantScriptFields!
                }
            `;
        }
    }

    if (productMappings.length || variantMappings.length) {
        if (productMappings.length) {
            sdl += `
            type CustomProductMappings {
                ${productMappings.map(([name, def]) => `${name}: ${def.graphQlType}`).join('\n')}
            }
            `;
        }
        if (variantMappings.length) {
            sdl += `
            type CustomProductVariantMappings {
                ${variantMappings.map(([name, def]) => `${name}: ${def.graphQlType}`).join('\n')}
            }
            `;
        }
        if (productMappings.length && variantMappings.length) {
            sdl += `
                union CustomMappings = CustomProductMappings | CustomProductVariantMappings

                extend type SearchResult {
                    customMappings: CustomMappings! @deprecated(reason: "Use customProductMappings or customProductVariantMappings")
                    customProductMappings: CustomProductMappings!
                    customProductVariantMappings: CustomProductVariantMappings!
                }
            `;
        } else if (productMappings.length) {
            sdl += `
                extend type SearchResult {
                    customMappings: CustomProductMappings! @deprecated(reason: "Use customProductMappings or customProductVariantMappings")
                    customProductMappings: CustomProductMappings!
                }
            `;
        } else if (variantMappings.length) {
            sdl += `
                extend type SearchResult {
                    customMappings: CustomProductVariantMappings! @deprecated(reason: "Use customProductMappings or customProductVariantMappings")
                    customProductVariantMappings: CustomProductVariantMappings!
                }
            `;
        }
    }
    return sdl.length
        ? gql`
              ${sdl}
          `
        : undefined;
}
