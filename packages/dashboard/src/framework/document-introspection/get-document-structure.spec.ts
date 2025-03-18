import { graphql } from 'gql.tada';
import { parse } from 'graphql';
import { describe, it, expect } from 'vitest';

import { getListQueryFields } from './get-document-structure.js';

describe('getListQueryFields', () => {
    it('should extract fields from a simple paginated list query', () => {
        const doc = graphql(`
            query {
                products {
                    items {
                        id
                        name
                    }
                }
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'id',
                nullable: false,
                type: 'ID',
            },
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'name',
                nullable: false,
                type: 'String',
            },
        ]);
    });

    it('should handle a fragment of the main entity in the query', () => {
        const doc = graphql(`
            query {
                products {
                    items {
                        ...ProductFields
                    }
                }
            }

            fragment ProductFields on Product {
                id
                name
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'id',
                nullable: false,
                type: 'ID',
            },
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'name',
                nullable: false,
                type: 'String',
            },
        ]);
    });

    it('should handle a fragment of a nested entity in the query', () => {
        const doc = graphql(/* graphql*/ `
            query {
                products {
                    items {
                        id
                        featuredAsset {
                            ...Asset
                        }
                    }
                }
            }

            fragment Asset on Asset {
                preview
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([
            {
                isPaginatedList: false,
                isScalar: true,
                list: false,
                name: 'id',
                nullable: false,
                type: 'ID',
            },
            {
                isPaginatedList: false,
                isScalar: false,
                list: false,
                name: 'featuredAsset',
                nullable: true,
                type: 'Asset',
            },
        ]);
    });

    it('should return empty array for non-paginated queries', () => {
        const doc = graphql(`
            query {
                product {
                    id
                }
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([]);
    });

    it('should handle empty items selection set', () => {
        const doc = graphql(`
            query {
                products {
                    totalItems
                }
            }
        `);

        const fields = getListQueryFields(doc);
        expect(fields).toEqual([]);
    });
});
