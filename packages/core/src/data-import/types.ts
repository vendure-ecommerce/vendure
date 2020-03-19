import { LanguageCode } from '@vendure/common/lib/generated-types';

import { Zone } from '../entity/zone/zone.entity';

export type ZoneMap = Map<string, { entity: Zone; members: string[] }>;

export interface CountryDefinition {
    code: string;
    name: string;
    zone: string;
}

export interface FacetValueCollectionFilterDefinition {
    code: 'facet-value-filter';
    args: {
        facetValueNames: string[];
        containsAny: boolean;
    };
}

export type CollectionFilterDefinition = FacetValueCollectionFilterDefinition;

export interface CollectionDefinition {
    name: string;
    description?: string;
    private?: boolean;
    filters?: CollectionFilterDefinition[];
    parentName?: string;
    assetPaths?: string[];
}

/**
 * @description
 * An object defining initial settings for a new Vendure installation.
 *
 * @docsCategory import-export
 */
export interface InitialData {
    defaultLanguage: LanguageCode;
    defaultZone: string;
    countries: CountryDefinition[];
    taxRates: Array<{ name: string; percentage: number }>;
    shippingMethods: Array<{ name: string; price: number }>;
    collections: CollectionDefinition[];
}
