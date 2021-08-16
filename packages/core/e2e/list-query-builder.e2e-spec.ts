import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { ListQueryPlugin } from './fixtures/test-plugins/list-query-plugin';
import { LanguageCode, SortOrder } from './graphql/generated-e2e-admin-types';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { fixPostgresTimezone } from './utils/fix-pg-timezone';

fixPostgresTimezone();

describe('ListQueryBuilder', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            apiOptions: {
                shopListQueryLimit: 10,
                adminListQueryLimit: 30,
            },
            plugins: [ListQueryPlugin],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    function getItemLabels(items: any[]): string[] {
        return items.map((x: any) => x.label).sort();
    }

    describe('pagination', () => {
        it('all en', async () => {
            const { testEntities } = await adminClient.query(
                GET_LIST,
                {
                    options: {},
                },
                { languageCode: LanguageCode.en },
            );

            expect(testEntities.totalItems).toBe(6);
            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
            expect(testEntities.items.map((i: any) => i.name)).toEqual([
                'apple',
                'bike',
                'cake',
                'dog',
                'egg',
                'baum', // if default en lang does not exist, use next available lang
            ]);
        });

        it('all de', async () => {
            const { testEntities } = await adminClient.query(
                GET_LIST,
                {
                    options: {},
                },
                { languageCode: LanguageCode.de },
            );

            expect(testEntities.totalItems).toBe(6);
            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
            expect(testEntities.items.map((i: any) => i.name)).toEqual([
                'apfel',
                'fahrrad',
                'kuchen',
                'hund',
                'egg', // falls back to en translation when de doesn't exist
                'baum',
            ]);
        });

        it('take', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    take: 2,
                },
            });

            expect(testEntities.totalItems).toBe(6);
            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B']);
        });

        it('skip', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    skip: 2,
                },
            });

            expect(testEntities.totalItems).toBe(6);
            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E', 'F']);
        });

        it('skip negative is ignored', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    skip: -1,
                },
            });

            expect(testEntities.totalItems).toBe(6);
            expect(testEntities.items.length).toBe(6);
        });

        it('take zero is ignored', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    take: 0,
                },
            });

            expect(testEntities.totalItems).toBe(6);
            expect(testEntities.items.length).toBe(6);
        });

        it('take negative is ignored', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    take: -1,
                },
            });

            expect(testEntities.totalItems).toBe(6);
            expect(testEntities.items.length).toBe(6);
        });

        it(
            'take beyond adminListQueryLimit',
            assertThrowsWithMessage(async () => {
                await adminClient.query(GET_LIST, {
                    options: {
                        take: 50,
                    },
                });
            }, 'Cannot take more than 30 results from a list query'),
        );

        it(
            'take beyond shopListQueryLimit',
            assertThrowsWithMessage(async () => {
                await shopClient.query(GET_LIST, {
                    options: {
                        take: 50,
                    },
                });
            }, 'Cannot take more than 10 results from a list query'),
        );
    });

    describe('string filtering', () => {
        it('eq', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        label: {
                            eq: 'B',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['B']);
        });

        it('notEq', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        label: {
                            notEq: 'B',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['A', 'C', 'D', 'E', 'F']);
        });

        it('contains', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        description: {
                            contains: 'adip',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['C']);
        });

        it('notContains', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        description: {
                            notContains: 'te',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B', 'E', 'F']);
        });

        it('in', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        label: {
                            in: ['A', 'C'],
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['A', 'C']);
        });

        it('notIn', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        label: {
                            notIn: ['A', 'C'],
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['B', 'D', 'E', 'F']);
        });

        describe('regex', () => {
            it('simple substring', async () => {
                const { testEntities } = await adminClient.query(GET_LIST, {
                    options: {
                        filter: {
                            description: {
                                regex: 'or',
                            },
                        },
                    },
                });

                expect(getItemLabels(testEntities.items)).toEqual(['A', 'B', 'D']);
            });

            it('start of string', async () => {
                const { testEntities } = await adminClient.query(GET_LIST, {
                    options: {
                        filter: {
                            description: {
                                regex: '^in',
                            },
                        },
                    },
                });

                expect(getItemLabels(testEntities.items)).toEqual(['E']);
            });

            it('end of string', async () => {
                const { testEntities } = await adminClient.query(GET_LIST, {
                    options: {
                        filter: {
                            description: {
                                regex: 'or$',
                            },
                        },
                    },
                });

                expect(getItemLabels(testEntities.items)).toEqual(['D']);
            });

            it('alternation', async () => {
                const { testEntities } = await adminClient.query(GET_LIST, {
                    options: {
                        filter: {
                            description: {
                                regex: 'dolor|tempor',
                            },
                        },
                    },
                });

                expect(getItemLabels(testEntities.items)).toEqual(['B', 'D']);
            });

            it('complex', async () => {
                const { testEntities } = await adminClient.query(GET_LIST, {
                    options: {
                        filter: {
                            description: {
                                regex: '(dolor|tempor)|inc[i]?d[^a]d.*nt',
                            },
                        },
                    },
                });

                expect(getItemLabels(testEntities.items)).toEqual(['B', 'D', 'E']);
            });
        });
    });

    describe('boolean filtering', () => {
        it('eq', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        active: {
                            eq: false,
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'E', 'F']);
        });
    });

    describe('number filtering', () => {
        it('eq', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        order: {
                            eq: 1,
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['B']);
        });

        it('lt', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        order: {
                            lt: 1,
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['A']);
        });

        it('lte', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        order: {
                            lte: 1,
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B']);
        });

        it('gt', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        order: {
                            gt: 1,
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E', 'F']);
        });

        it('gte', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        order: {
                            gte: 1,
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['B', 'C', 'D', 'E', 'F']);
        });

        it('between', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        order: {
                            between: {
                                start: 2,
                                end: 4,
                            },
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E']);
        });
    });

    describe('date filtering', () => {
        it('before', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        date: {
                            before: '2020-01-20T10:00:00.000Z',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B']);
        });

        it('before on same date', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        date: {
                            before: '2020-01-15T17:00:00.000Z',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B']);
        });

        it('after', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        date: {
                            after: '2020-01-20T10:00:00.000Z',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E', 'F']);
        });

        it('after on same date', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        date: {
                            after: '2020-01-25T09:00:00.000Z',
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E', 'F']);
        });

        it('between', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        date: {
                            between: {
                                start: '2020-01-10T10:00:00.000Z',
                                end: '2020-01-20T10:00:00.000Z',
                            },
                        },
                    },
                },
            });

            expect(getItemLabels(testEntities.items)).toEqual(['B']);
        });
    });

    describe('sorting', () => {
        it('sort by string', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        label: SortOrder.DESC,
                    },
                },
            });

            expect(testEntities.items.map((x: any) => x.label)).toEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it('sort by number', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        order: SortOrder.DESC,
                    },
                },
            });
            expect(testEntities.items.map((x: any) => x.label)).toEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it('sort by date', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        date: SortOrder.DESC,
                    },
                },
            });
            expect(testEntities.items.map((x: any) => x.label)).toEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it('sort by ID', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        id: SortOrder.DESC,
                    },
                },
            });
            expect(testEntities.items.map((x: any) => x.label)).toEqual(['F', 'E', 'D', 'C', 'B', 'A']);
        });

        it('sort by translated field en', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            });
            expect(testEntities.items.map((x: any) => x.name)).toEqual([
                'apple',
                'baum', // falling back to de here
                'bike',
                'cake',
                'dog',
                'egg',
            ]);
        });

        it('sort by translated field de', async () => {
            const { testEntities } = await adminClient.query(
                GET_LIST,
                {
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                    },
                },
                { languageCode: LanguageCode.de },
            );
            expect(testEntities.items.map((x: any) => x.name)).toEqual([
                'apfel',
                'baum',
                'egg',
                'fahrrad',
                'hund',
                'kuchen',
            ]);
        });

        it('sort by translated field en with take', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                    take: 4,
                },
            });
            expect(testEntities.items.map((x: any) => x.name)).toEqual(['apple', 'baum', 'bike', 'cake']);
        });

        it('sort by translated field de with take', async () => {
            const { testEntities } = await adminClient.query(
                GET_LIST,
                {
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                        take: 4,
                    },
                },
                { languageCode: LanguageCode.de },
            );
            expect(testEntities.items.map((x: any) => x.name)).toEqual(['apfel', 'baum', 'egg', 'fahrrad']);
        });
    });

    describe('calculated fields', () => {
        it('filter by simple calculated property', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        descriptionLength: {
                            lt: 12,
                        },
                    },
                },
            });
            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B']);
        });

        it('filter by calculated property with join', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    filter: {
                        price: {
                            lt: 14,
                        },
                    },
                },
            });
            expect(getItemLabels(testEntities.items)).toEqual(['A', 'B', 'E']);
        });

        it('sort by simple calculated property', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        descriptionLength: SortOrder.ASC,
                    },
                },
            });
            expect(testEntities.items.map((x: any) => x.label)).toEqual(['B', 'A', 'E', 'D', 'C', 'F']);
        });

        it('sort by calculated property with join', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        price: SortOrder.ASC,
                    },
                },
            });
            expect(testEntities.items.map((x: any) => x.label)).toEqual(['B', 'A', 'E', 'D', 'C', 'F']);
        });
    });

    describe('multiple clauses', () => {
        it('sort by translated field en & filter', async () => {
            const { testEntities } = await adminClient.query(GET_LIST, {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                    filter: {
                        order: {
                            gte: 1,
                        },
                    },
                },
            });
            expect(testEntities.items.map((x: any) => x.name)).toEqual([
                'baum',
                'bike',
                'cake',
                'dog',
                'egg',
            ]);
        });

        it('sort by translated field de & filter', async () => {
            const { testEntities } = await adminClient.query(
                GET_LIST,
                {
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                        filter: {
                            order: {
                                gte: 1,
                            },
                        },
                    },
                },
                { languageCode: LanguageCode.de },
            );
            expect(testEntities.items.map((x: any) => x.name)).toEqual([
                'baum',
                'egg',
                'fahrrad',
                'hund',
                'kuchen',
            ]);
        });

        it('sort by translated field de & filter & pagination', async () => {
            const { testEntities } = await adminClient.query(
                GET_LIST,
                {
                    options: {
                        sort: {
                            name: SortOrder.ASC,
                        },
                        filter: {
                            order: {
                                gte: 1,
                            },
                        },
                        take: 2,
                        skip: 1,
                    },
                },
                { languageCode: LanguageCode.de },
            );
            expect(testEntities.items.map((x: any) => x.name)).toEqual(['egg', 'fahrrad']);
        });
    });
});

const GET_LIST = gql`
    query GetTestEntities($options: TestEntityListOptions) {
        testEntities(options: $options) {
            totalItems
            items {
                id
                label
                name
                date
            }
        }
    }
`;
