import {
    Coordinate,
    CurrencyCode,
    PriceRange,
    SearchResult,
    SearchResultAsset,
    SinglePrice,
} from '@vendure/common/lib/generated-types';
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

    const productAsset: SearchResultAsset | undefined = !raw.si_productAssetId
        ? undefined
        : {
              id: raw.si_productAssetId,
              preview: raw.si_productPreview,
              focalPoint: parseFocalPoint(raw.si_productPreviewFocalPoint),
          };
    const productVariantAsset: SearchResultAsset | undefined = !raw.si_productVariantAssetId
        ? undefined
        : {
              id: raw.si_productVariantAssetId,
              preview: raw.si_productVariantPreview,
              focalPoint: parseFocalPoint(raw.si_productVariantPreviewFocalPoint),
          };

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
        productAsset,
        productVariantAsset,
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

/**
 * Given the raw query results containing rows with a `collections` property line "1,2,1,2",
 * this function returns a map of Collection ids => count of how many times they occur.
 */
export function createCollectionIdCountMap(collectionsResult: Array<{ collections: string }>) {
    const result = new Map<ID, number>();
    for (const res of collectionsResult) {
        const collectionIds: ID[] = unique(res.collections.split(',').filter(x => x !== ''));
        for (const id of collectionIds) {
            const count = result.get(id);
            const newCount = count ? count + 1 : 1;
            result.set(id, newCount);
        }
    }
    return result;
}

function parseFocalPoint(focalPoint: any): Coordinate | undefined {
    if (focalPoint && typeof focalPoint === 'string') {
        try {
            return JSON.parse(focalPoint);
        } catch (e) {
            // fall though
        }
    }
    return;
}
