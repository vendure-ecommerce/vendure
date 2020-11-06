import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { ListQueryPlugin } from './fixtures/test-plugins/list-query-plugin';
import { fixPostgresTimezone } from './utils/fix-pg-timezone';

fixPostgresTimezone();

describe('ListQueryBuilder', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
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

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'E']);
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

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E']);
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

            expect(getItemLabels(testEntities.items)).toEqual(['B', 'C', 'D', 'E']);
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

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E']);
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

            expect(getItemLabels(testEntities.items)).toEqual(['C', 'D', 'E']);
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
});

const GET_LIST = gql`
    query GetTestEntities($options: TestEntityListOptions) {
        testEntities(options: $options) {
            totalItems
            items {
                id
                label
                date
            }
        }
    }
`;
