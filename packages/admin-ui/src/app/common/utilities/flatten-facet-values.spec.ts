import { isPrivate } from '@babel/types';

import { FacetWithValues, LanguageCode } from '../generated-types';

import { flattenFacetValues } from './flatten-facet-values';

describe('flattenFacetValues()', () => {
    it('works', () => {
        const facetValue1 = {
            id: '1',
            createdAt: '',
            updatedAt: '',
            languageCode: LanguageCode.en,
            code: 'Balistreri,_Lesch_and_Crooks',
            name: 'Balistreri, Lesch and Crooks',
            translations: [],
            facet: {} as any,
        };
        const facetValue2 = {
            id: '2',
            createdAt: '',
            updatedAt: '',
            languageCode: LanguageCode.en,
            code: 'Rodriguez_-_Von',
            name: 'Rodriguez - Von',
            translations: [],
            facet: {} as any,
        };
        const facetValue3 = {
            id: '3',
            createdAt: '',
            updatedAt: '',
            languageCode: LanguageCode.en,
            code: 'Hahn_and_Sons',
            name: 'Hahn and Sons',
            translations: [],
            facet: {} as any,
        };
        const facetValue4 = {
            id: '4',
            createdAt: '',
            updatedAt: '',
            languageCode: LanguageCode.en,
            code: 'Balistreri,_Lesch_and_Crooks',
            name: 'Balistreri, Lesch and Crooks',
            translations: [],
            facet: {} as any,
        };
        const facetValue5 = {
            id: '5',
            createdAt: '',
            updatedAt: '',
            languageCode: LanguageCode.en,
            code: 'Rodriguez_-_Von',
            name: 'Rodriguez - Von',
            translations: [],
            facet: {} as any,
        };

        const input: FacetWithValues.Fragment[] = [
            {
                id: '1',
                createdAt: '',
                updatedAt: '',
                isPrivate: false,
                languageCode: LanguageCode.en,
                code: 'brand',
                name: 'Brand',
                translations: [],
                values: [facetValue1, facetValue2, facetValue3],
            },
            {
                id: '2',
                createdAt: '',
                updatedAt: '',
                isPrivate: false,
                languageCode: LanguageCode.en,
                code: 'type',
                name: 'Type',
                translations: [],
                values: [facetValue4, facetValue5],
            },
        ];

        const result = flattenFacetValues(input);

        expect(result).toEqual([facetValue1, facetValue2, facetValue3, facetValue4, facetValue5]);
    });
});
