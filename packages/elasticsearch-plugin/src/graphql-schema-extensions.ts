import { gql } from 'apollo-server-core';
import { DocumentNode } from 'graphql';

import { ElasticsearchOptions } from './options';

export function generateSchemaExtensions(options: ElasticsearchOptions): DocumentNode {
    return gql`
        extend type SearchResponse {
            prices: SearchResponsePriceData!
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
        }

        input PriceRangeInput {
            min: Int!
            max: Int!
        }

        ${generateCustomMappingTypes(options)}
    `;
}

function generateCustomMappingTypes(options: ElasticsearchOptions): DocumentNode | undefined {
    const productMappings = Object.entries(options.customProductMappings || {});
    const variantMappings = Object.entries(options.customProductVariantMappings || {});
    if (productMappings.length || variantMappings.length) {
        let sdl = ``;
        if (productMappings.length) {
            sdl += `
            type CustomProductMappings {
                ${productMappings.map(([name, def]) => `${name}: ${def.graphQlType}`)}
            }
            `;
        }
        if (variantMappings.length) {
            sdl += `
            type CustomProductVariantMappings {
                ${variantMappings.map(([name, def]) => `${name}: ${def.graphQlType}`)}
            }
            `;
        }
        if (productMappings.length && variantMappings.length) {
            sdl += `
                union CustomMappings = CustomProductMappings | CustomProductVariantMappings

                extend type SearchResult {
                    customMappings: CustomMappings!
                }
            `;
        } else if (productMappings.length) {
            sdl += `
                extend type SearchResult {
                    customMappings: CustomProductMappings!
                }
            `;
        } else if (variantMappings.length) {
            sdl += `
                extend type SearchResult {
                    customMappings: CustomProductVariantMappings!
                }
            `;
        }

        return gql`
            ${sdl}
        `;
    }
}
