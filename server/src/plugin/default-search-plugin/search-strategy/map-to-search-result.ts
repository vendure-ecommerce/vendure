import { CurrencyCode, SearchResult } from '../../../../../shared/generated-types';

/**
 * Maps a raw database result to a SearchResult.
 */
export function mapToSearchResult(raw: any, currencyCode: CurrencyCode): SearchResult {
    return {
        sku: raw.si_sku,
        slug: raw.si_slug,
        price: raw.si_price,
        currencyCode,
        productVariantId: raw.si_productVariantId,
        productId: raw.si_productId,
        productName: raw.si_productName,
        productVariantName: raw.si_productVariantName,
        description: raw.si_description,
        facetIds: raw.si_facetIds.split(',').map(x => x.trim()),
        facetValueIds: raw.si_facetValueIds.split(',').map(x => x.trim()),
        productPreview: raw.si_productPreview,
        productVariantPreview: raw.si_productVariantPreview,
        score: raw.score || 0,
    };
}
