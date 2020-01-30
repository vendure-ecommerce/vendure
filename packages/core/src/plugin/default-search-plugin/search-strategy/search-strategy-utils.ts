import { CurrencyCode, PriceRange, SearchResult, SinglePrice } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

/**
 * Maps a raw database result to a SearchResult.
 */
export function mapToSearchResult(raw: any, currencyCode: CurrencyCode): SearchResult {
    const price =
        raw.minPrice !== undefined
            ? ({ min: raw.minPrice, max: raw.maxPrice } as PriceRange)
            : ({ value: raw.si_price } as SinglePrice);
    const priceWithTax =
        raw.minPriceWithTax !== undefined
            ? ({ min: raw.minPriceWithTax, max: raw.maxPriceWithTax } as PriceRange)
            : ({ value: raw.si_priceWithTax } as SinglePrice);

    const enabled = raw.productEnabled != null ? !!Number(raw.productEnabled) : raw.si_enabled;
    return {
        sku: raw.si_sku,
        slug: raw.si_slug,
        price,
        enabled,
        priceWithTax,
        currencyCode,
        productVariantId: raw.si_productVariantId,
        productId: raw.si_productId,
        productName: raw.si_productName,
        productVariantName: raw.si_productVariantName,
        description: raw.si_description,
        facetIds: raw.si_facetIds.split(',').map((x: string) => x.trim()),
        facetValueIds: raw.si_facetValueIds.split(',').map((x: string) => x.trim()),
        collectionIds: raw.si_collectionIds.split(',').map((x: string) => x.trim()),
        channelIds: raw.si_channelIds.split(',').map((x: string) => x.trim()),
        productPreview: raw.si_productPreview,
        productVariantPreview: raw.si_productVariantPreview,
        score: raw.score || 0,
    };
}

/**
 * Given the raw query results containing rows with a `facetValues` property line "1,2,1,2",
 * this function returns a map of FacetValue ids => count of how many times they occur.
 */
export function createFacetIdCountMap(facetValuesResult: Array<{ facetValues: string }>) {
    const result = new Map<ID, number>();
    for (const res of facetValuesResult) {
        const facetValueIds: ID[] = unique(res.facetValues.split(',').filter(x => x !== ''));
        for (const id of facetValueIds) {
            const count = result.get(id);
            const newCount = count ? count + 1 : 1;
            result.set(id, newCount);
        }
    }
    return result;
}
