import { CustomFields } from '../../../shared/shared-types';

import { addGraphQLCustomFields } from './graphql-custom-fields';

describe('addGraphQLCustomFields()', () => {
    it('uses JSON scalar if no custom fields defined', () => {
        const input = `
            type Product {
                id: ID
            }
        `;
        const customFieldConfig: CustomFields = {
            Product: [],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });

    it('extends a type', () => {
        const input = `
            type Product {
                id: ID
            }
        `;
        const customFieldConfig: CustomFields = {
            Product: [{ name: 'available', type: 'boolean' }],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });

    it('extends a type with a translation', () => {
        const input = `
                    type Product {
                        id: ID
                        translations: [ProductTranslation!]!
                    }

                    type ProductTranslation {
                        id: ID
                    }
                `;
        const customFieldConfig: CustomFields = {
            Product: [{ name: 'available', type: 'boolean' }, { name: 'shortName', type: 'localeString' }],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });

    it('extends a type with a Create input', () => {
        const input = `
                    type Product {
                        id: ID
                    }

                    input CreateProductInput {
                        image: String
                    }
                `;
        const customFieldConfig: CustomFields = {
            Product: [{ name: 'available', type: 'boolean' }, { name: 'shortName', type: 'localeString' }],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });

    it('extends a type with an Update input', () => {
        const input = `
                    type Product {
                        id: ID
                    }

                    input UpdateProductInput {
                        image: String
                    }
                `;
        const customFieldConfig: CustomFields = {
            Product: [{ name: 'available', type: 'boolean' }, { name: 'shortName', type: 'localeString' }],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });

    it('extends a type with a Create input and a translation', () => {
        const input = `
                    type Product {
                        id: ID
                    }

                    type ProductTranslation {
                        id: ID
                    }

                    input ProductTranslationInput {
                        id: ID
                    }

                    input CreateProductInput {
                        image: String
                    }
                `;
        const customFieldConfig: CustomFields = {
            Product: [{ name: 'available', type: 'boolean' }, { name: 'shortName', type: 'localeString' }],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });

    it('extends a type with SortParameters', () => {
        const input = `
                    type Product {
                        id: ID
                    }

                    input ProductSortParameter {
                        id: SortOrder
                    }

                    enum SortOrder {
                        ASC
                        DESC
                    }
                `;
        const customFieldConfig: CustomFields = {
            Product: [{ name: 'available', type: 'boolean' }, { name: 'shortName', type: 'localeString' }],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });

    it('extends a type with FilterParameters', () => {
        const input = `
                    type Product {
                        name: String
                    }

                    input ProductFilterParameter {
                        id: StringOperators
                    }

                    input StringOperators {
                        eq: String
                    }

                    input NumberOperators {
                        eq: Float
                    }

                    input DateOperators {
                        eq: String
                    }

                    input BooleanOperators {
                        eq: Boolean
                    }

                `;
        const customFieldConfig: CustomFields = {
            Product: [
                { name: 'available', type: 'boolean' },
                { name: 'shortName', type: 'localeString' },
                { name: 'rating', type: 'float' },
                { name: 'published', type: 'datetime' },
            ],
        };
        const result = addGraphQLCustomFields(input, customFieldConfig);
        expect(result).toMatchSnapshot();
    });
});
