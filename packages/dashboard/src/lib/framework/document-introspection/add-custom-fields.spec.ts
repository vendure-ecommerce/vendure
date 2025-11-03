import { CustomFieldConfig, CustomFields } from '@vendure/common/lib/generated-types';
import { graphql } from 'gql.tada';
import { DocumentNode, FieldNode, FragmentDefinitionNode, Kind, print } from 'graphql';
import { beforeEach, describe, expect, it } from 'vitest';

import { addCustomFields } from './add-custom-fields.js';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
describe('addCustomFields()', () => {
    /**
     * Normalizes the indentation of a string to make it easier to compare with the expected output
     */
    function normalizeIndentation(str: string): string {
        const lines = str.replace(/    /g, '  ').split('\n');
        const indentLength = lines[1].search(/\S|$/); // Find the first non-whitespace character
        return lines
            .map(line => line.slice(indentLength))
            .join('\n')
            .trim()
            .replace(/"/g, '');
    }

    describe('Query handling', () => {
        it('Adds customFields to entity query', () => {
            const documentNode = graphql(`
                query GetProduct {
                    product {
                        id
                        name
                    }
                }
            `);
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [
                { name: 'custom1', type: 'string', list: false },
                { name: 'custom2', type: 'boolean', list: false },
            ]);
            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });

            expect(print(result)).toBe(
                normalizeIndentation(`
                query GetProduct {
                    product {
                        id
                        name
                        customFields {
                            custom1
                            custom2
                        }
                    }
                }
            `),
            );
        });

        it('Adds customFields to paginated list', () => {
            const documentNode = graphql(`
                query GetProducts {
                    products {
                        items {
                            id
                            name
                        }
                    }
                }
            `);
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [
                { name: 'custom1', type: 'string', list: false },
                { name: 'custom2', type: 'boolean', list: false },
            ]);
            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            expect(print(result)).toBe(
                normalizeIndentation(`
                query GetProducts {
                    products {
                        items {
                            id
                            name
                            customFields {
                                custom1
                                custom2
                            }
                        }
                    }
                }
            `),
            );
        });
    });

    describe('Fragment handling', () => {
        const productWithVariantsFragment = graphql(`
            fragment ProductWithVariants on Product {
                id
                translations {
                    languageCode
                    name
                }
            }
        `);

        const productVariantFragment = graphql(`
            fragment ProductVariant on ProductVariant {
                id
            }
        `);

        const productOptionGroupFragment = graphql(`
            fragment ProductOptionGroup on ProductOptionGroup {
                id
            }
        `);

        const productOptionFragment = graphql(`
            fragment ProductOption on ProductOption {
                id
            }
        `);

        const userFragment = graphql(`
            fragment User on User {
                id
            }
        `);

        const customerFragment = graphql(`
            fragment Customer on Customer {
                id
            }
        `);

        const addressFragment = graphql(`
            fragment Address on Address {
                id
            }
        `);

        let documentNode: DocumentNode;

        beforeEach(() => {
            documentNode = graphql(
                `
                    query GetProductWithVariants {
                        product {
                            ...ProductWithVariants
                        }
                    }
                `,
                [productWithVariantsFragment],
            );
        });

        it('Adds customFields to Product fragment', () => {
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [
                { name: 'custom1', type: 'string', list: false },
                { name: 'custom2', type: 'boolean', list: false },
            ]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const productFragmentDef = result.definitions[1] as FragmentDefinitionNode;
            const customFieldsDef = productFragmentDef.selectionSet.selections[2] as FieldNode;
            expect(productFragmentDef.selectionSet.selections.length).toBe(3);
            expect(customFieldsDef.selectionSet!.selections.length).toBe(2);
            expect((customFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe('custom1');
            expect((customFieldsDef.selectionSet!.selections[1] as FieldNode).name.value).toBe('custom2');
        });

        it('Adds customFields to Product translations', () => {
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [
                { name: 'customLocaleString', type: 'localeString', list: false },
            ]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const productFragmentDef = result.definitions[1] as FragmentDefinitionNode;
            const translationsField = productFragmentDef.selectionSet.selections[1] as FieldNode;
            const customTranslationFieldsDef = translationsField.selectionSet!.selections[2] as FieldNode;
            expect(translationsField.selectionSet!.selections.length).toBe(3);
            expect((customTranslationFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe(
                'customLocaleString',
            );
        });

        function addsCustomFieldsToType(type: keyof CustomFields, fragment: DocumentNode) {
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set(type, [{ name: 'custom', type: 'boolean', list: false }]);

            const result = addCustomFields(fragment, { customFieldsMap: customFieldsConfig });
            const fragmentDef = result.definitions[0] as FragmentDefinitionNode;
            const customFieldsDef = fragmentDef.selectionSet.selections[1] as FieldNode;
            expect(fragmentDef.selectionSet.selections.length).toBe(2);
            expect(customFieldsDef.selectionSet!.selections.length).toBe(1);
            expect((customFieldsDef.selectionSet!.selections[0] as FieldNode).name.value).toBe('custom');
        }

        it('Does not duplicate customFields selection set', () => {
            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [{ name: 'custom', type: 'boolean', list: false }]);
            const result1 = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const result2 = addCustomFields(result1, { customFieldsMap: customFieldsConfig });

            const fragmentDef = result2.definitions[1] as FragmentDefinitionNode;
            const customFieldSelections = fragmentDef.selectionSet.selections.filter(
                s => s.kind === Kind.FIELD && s.name.value === 'customFields',
            );
            expect(customFieldSelections.length).toBe(1);
        });

        it('Adds customFields to ProductVariant fragment', () => {
            addsCustomFieldsToType('ProductVariant', productVariantFragment);
        });

        it('Adds customFields to ProductOptionGroup fragment', () => {
            addsCustomFieldsToType('ProductOptionGroup', productOptionGroupFragment);
        });

        it('Adds customFields to ProductOption fragment', () => {
            addsCustomFieldsToType('ProductOption', productOptionFragment);
        });

        it('Adds customFields to User fragment', () => {
            addsCustomFieldsToType('User', userFragment);
        });

        it('Adds customFields to Customer fragment', () => {
            addsCustomFieldsToType('Customer', customerFragment);
        });

        it('Adds customFields to Address fragment', () => {
            addsCustomFieldsToType('Address', addressFragment);
        });
    });

    describe('Nested entity handling', () => {
        it('User example: Should not add custom fields to Asset fragment used in nested featuredAsset', () => {
            const assetFragment = graphql(`
                fragment Asset on Asset {
                    id
                    createdAt
                    updatedAt
                    name
                    fileSize
                    mimeType
                    type
                    preview
                    source
                    width
                    height
                    focalPoint {
                        x
                        y
                    }
                }
            `);

            const documentNode = graphql(
                `
                    query CollectionList($options: CollectionListOptions) {
                        collections(options: $options) {
                            items {
                                id
                                createdAt
                                updatedAt
                                featuredAsset {
                                    ...Asset
                                }
                                name
                                slug
                                breadcrumbs {
                                    id
                                    name
                                    slug
                                }
                                children {
                                    id
                                    name
                                }
                                position
                                isPrivate
                                parentId
                                productVariants {
                                    totalItems
                                }
                            }
                            totalItems
                        }
                    }
                `,
                [assetFragment],
            );

            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Collection', [
                { name: 'featuredProducts', type: 'relation', list: true, scalarFields: ['id', 'name'] },
                { name: 'alternativeAsset', type: 'relation', list: false, scalarFields: ['id', 'name'] },
            ]);
            customFieldsConfig.set('Asset', [
                { name: 'assetCustomField1', type: 'string', list: false },
                { name: 'assetCustomField2', type: 'string', list: false },
                { name: 'assetCustomField3', type: 'string', list: false },
            ]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const printed = print(result);

            // Should add customFields ONLY to Collection items (top-level entity)
            expect(printed).toContain('customFields {');
            expect(printed).toContain('featuredProducts {');
            expect(printed).toContain('alternativeAsset {');

            // Should NOT add customFields to Asset fragment (only used in nested context)
            const fragmentMatch = printed.match(/fragment Asset on Asset\s*\{[^}]*\}/s);
            expect(fragmentMatch).toBeTruthy();
            expect(fragmentMatch![0]).not.toContain('customFields');
            expect(fragmentMatch![0]).not.toContain('assetCustomField1');

            // Should NOT add customFields to children (nested Collection entities)
            const childrenMatch = printed.match(/children\s*\{[^}]+\}/s);
            expect(childrenMatch).toBeTruthy();
            expect(childrenMatch![0]).not.toContain('customFields');

            // Should NOT add customFields to breadcrumbs
            const breadcrumbsMatch = printed.match(/breadcrumbs\s*\{[^}]+\}/s);
            expect(breadcrumbsMatch).toBeTruthy();
            expect(breadcrumbsMatch![0]).not.toContain('customFields');
        });

        it('Should only add custom fields to top-level entity, not nested related entities', () => {
            const documentNode = graphql(`
                query CollectionList($options: CollectionListOptions) {
                    collections(options: $options) {
                        items {
                            id
                            name
                            slug
                            featuredAsset {
                                id
                                preview
                            }
                            children {
                                id
                                name
                                slug
                            }
                            breadcrumbs {
                                id
                                name
                                slug
                            }
                        }
                        totalItems
                    }
                }
            `);

            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Collection', [
                { name: 'featuredProducts', type: 'relation', list: true, scalarFields: ['id', 'name'] },
                { name: 'alternativeAsset', type: 'relation', list: false, scalarFields: ['id', 'name'] },
            ]);
            customFieldsConfig.set('Asset', [
                { name: 'assetCustomField1', type: 'string', list: false },
                { name: 'assetCustomField2', type: 'string', list: false },
            ]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const printed = print(result);

            // Should add customFields to top-level Collection (items)
            expect(printed).toContain('customFields {');
            expect(printed).toContain('featuredProducts {');
            expect(printed).toContain('alternativeAsset {');

            // Should NOT add customFields to nested Collection entities (children, breadcrumbs)
            const childrenMatch = printed.match(/children\s*\{[^}]+\}/s);
            const breadcrumbsMatch = printed.match(/breadcrumbs\s*\{[^}]+\}/s);

            expect(childrenMatch).toBeTruthy();
            expect(breadcrumbsMatch).toBeTruthy();
            expect(childrenMatch![0]).not.toContain('customFields');
            expect(breadcrumbsMatch![0]).not.toContain('customFields');

            // Should NOT add customFields to nested Asset entity (featuredAsset)
            const featuredAssetMatch = printed.match(/featuredAsset\s*\{[^}]+\}/s);
            expect(featuredAssetMatch).toBeTruthy();
            expect(featuredAssetMatch![0]).not.toContain('customFields');
            expect(featuredAssetMatch![0]).not.toContain('assetCustomField1');
        });

        it('Should NOT add custom fields to fragments that are only used in nested contexts', () => {
            const assetFragment = graphql(`
                fragment Asset on Asset {
                    id
                    name
                    preview
                }
            `);

            const documentNode = graphql(
                `
                    query ProductList($options: ProductListOptions) {
                        products(options: $options) {
                            items {
                                id
                                name
                                featuredAsset {
                                    ...Asset
                                }
                                variants {
                                    id
                                    name
                                    assets {
                                        ...Asset
                                    }
                                }
                            }
                            totalItems
                        }
                    }
                `,
                [assetFragment],
            );

            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [{ name: 'productCustomField', type: 'string', list: false }]);
            customFieldsConfig.set('Asset', [{ name: 'assetCustomField', type: 'string', list: false }]);
            customFieldsConfig.set('ProductVariant', [
                { name: 'variantCustomField', type: 'string', list: false },
            ]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const printed = print(result);

            // Should add customFields to Product (top-level query entity)
            expect(printed).toContain('customFields {');
            expect(printed).toContain('productCustomField');

            // Should NOT add customFields to Asset fragment (only used in nested contexts)
            expect(printed).not.toMatch(/fragment Asset on Asset\s*\{[^}]*customFields/s);

            // Should NOT add customFields to nested ProductVariant entities
            const variantsMatch = printed.match(/variants\s*\{[^}]+\}/s);
            expect(variantsMatch).toBeTruthy();
            expect(variantsMatch![0]).not.toContain('customFields');
            expect(variantsMatch![0]).not.toContain('variantCustomField');
        });

        it('Should add custom fields to fragments used at top level', () => {
            const productFragment = graphql(`
                fragment ProductDetails on Product {
                    id
                    name
                    slug
                }
            `);

            const documentNode = graphql(
                `
                    query ProductList($options: ProductListOptions) {
                        products(options: $options) {
                            items {
                                ...ProductDetails
                                featuredAsset {
                                    id
                                    preview
                                }
                            }
                            totalItems
                        }
                    }
                `,
                [productFragment],
            );

            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Product', [{ name: 'productCustomField', type: 'string', list: false }]);
            customFieldsConfig.set('Asset', [{ name: 'assetCustomField', type: 'string', list: false }]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const printed = print(result);

            // Should add customFields to ProductDetails fragment (used at top level in items)
            expect(printed).toContain('fragment ProductDetails on Product');
            expect(printed).toContain('productCustomField');

            // Should NOT add customFields to featuredAsset (nested entity)
            const featuredAssetMatch = printed.match(/featuredAsset\s*\{[^}]+\}/s);
            expect(featuredAssetMatch).toBeTruthy();
            expect(featuredAssetMatch![0]).not.toContain('customFields');
        });

        it('Should handle complex nested structure with multiple entity types', () => {
            const documentNode = graphql(`
                query ComplexQuery {
                    orders {
                        items {
                            id
                            code
                            customer {
                                id
                                firstName
                                addresses {
                                    id
                                    streetLine1
                                    country {
                                        id
                                        name
                                    }
                                }
                            }
                            lines {
                                id
                                productVariant {
                                    id
                                    name
                                    product {
                                        id
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            `);

            const customFieldsConfig = new Map<string, CustomFieldConfig[]>();
            customFieldsConfig.set('Order', [{ name: 'orderCustomField', type: 'string', list: false }]);
            customFieldsConfig.set('Customer', [
                { name: 'customerCustomField', type: 'string', list: false },
            ]);
            customFieldsConfig.set('Address', [{ name: 'addressCustomField', type: 'string', list: false }]);
            customFieldsConfig.set('Product', [{ name: 'productCustomField', type: 'string', list: false }]);

            const result = addCustomFields(documentNode, { customFieldsMap: customFieldsConfig });
            const printed = print(result);

            // Should only add customFields to top-level Order entity
            expect(printed).toContain('customFields {');
            expect(printed).toContain('orderCustomField');

            // Should NOT add customFields to any nested entities
            expect(printed).not.toMatch(/customer\s*\{[^}]*customFields/s);
            expect(printed).not.toMatch(/addresses\s*\{[^}]*customFields/s);
            expect(printed).not.toMatch(/country\s*\{[^}]*customFields/s);
            expect(printed).not.toMatch(/productVariant\s*\{[^}]*customFields/s);
            expect(printed).not.toMatch(/product\s*\{[^}]*customFields/s);
        });
    });
});
