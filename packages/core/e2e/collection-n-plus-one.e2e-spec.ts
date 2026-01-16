/* eslint-disable @typescript-eslint/no-non-null-assertion, no-console, @typescript-eslint/restrict-template-expressions */
import {
    DefaultJobQueuePlugin,
    facetValueCollectionFilter,
    mergeConfig,
} from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import { LanguageCode } from './graphql/generated-e2e-admin-types';
import { CREATE_FACET, CREATE_FACET_VALUE } from './graphql/shared-definitions';
import { awaitRunningJobs } from './utils/await-running-jobs';

/**
 * A custom TypeORM logger that records all queries for analysis.
 * Used to benchmark and detect N+1 query issues.
 */
class QueryRecordingLogger implements TypeOrmLogger {
    private queries: Array<{ query: string; parameters?: any[] }> = [];
    private recording = false;

    startRecording(): void {
        this.queries = [];
        this.recording = true;
    }

    stopRecording(): Array<{ query: string; parameters?: any[] }> {
        this.recording = false;
        return [...this.queries];
    }

    getQueryCount(): number {
        return this.queries.length;
    }

    getQueries(): Array<{ query: string; parameters?: any[] }> {
        return [...this.queries];
    }

    clearQueries(): void {
        this.queries = [];
    }

    logQuery(query: string, parameters?: any[], _queryRunner?: QueryRunner): void {
        if (this.recording) {
            this.queries.push({ query, parameters });
        }
    }

    logQueryError(_error: string | Error, _query: string, _parameters?: any[], _queryRunner?: QueryRunner): void {
        // no-op for benchmark purposes
    }

    logQuerySlow(_time: number, _query: string, _parameters?: any[], _queryRunner?: QueryRunner): void {
        // no-op for benchmark purposes
    }

    logSchemaBuild(_message: string, _queryRunner?: QueryRunner): void {
        // no-op for benchmark purposes
    }

    logMigration(_message: string, _queryRunner?: QueryRunner): void {
        // no-op for benchmark purposes
    }

    log(_level: 'log' | 'info' | 'warn', _message: any, _queryRunner?: QueryRunner): void {
        // no-op for benchmark purposes
    }
}

// Create a shared logger instance
const queryLogger = new QueryRecordingLogger();

registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__'), 1000));

const NUM_COLLECTIONS = 15;

const { server, adminClient } = createTestEnvironment(
    mergeConfig(testConfig(), {
        plugins: [DefaultJobQueuePlugin],
        dbConnectionOptions: {
            logging: true,
            logger: queryLogger,
        },
    }),
);

/**
 * GraphQL query to fetch collections with productVariants { totalItems }
 * This is the query we want to benchmark for N+1 issues.
 * Note: We use take: 0 on productVariants to indicate we only want the count,
 * which allows the resolver to use the pre-fetched cached count.
 */
const GET_COLLECTIONS_WITH_PRODUCT_VARIANT_COUNT = gql`
    query GetCollectionsWithProductVariantCount($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                productVariants(options: { take: 0 }) {
                    totalItems
                }
            }
            totalItems
        }
    }
`;

const CREATE_COLLECTION = gql`
    mutation CreateCollection($input: CreateCollectionInput!) {
        createCollection(input: $input) {
            id
            name
        }
    }
`;

describe('Collection N+1 Query Benchmark', () => {
    const facetValueIds: string[] = [];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await awaitRunningJobs(adminClient);

        // Create a facet with multiple values to use for collection filters
        const { createFacet } = await adminClient.query<
            Codegen.CreateFacetMutation,
            Codegen.CreateFacetMutationVariables
        >(CREATE_FACET, {
            input: {
                code: 'benchmark-facet',
                isPrivate: false,
                translations: [{ languageCode: LanguageCode.en as any, name: 'Benchmark Facet' }],
            },
        });

        // Create facet values for each collection
        for (let i = 0; i < NUM_COLLECTIONS; i++) {
            const { createFacetValue } = await adminClient.query<
                Codegen.CreateFacetValueMutation,
                Codegen.CreateFacetValueMutationVariables
            >(CREATE_FACET_VALUE, {
                input: {
                    facetId: createFacet.id,
                    code: `benchmark-value-${i}`,
                    translations: [{ languageCode: LanguageCode.en, name: `Benchmark Value ${i}` }],
                },
            });
            facetValueIds.push(createFacetValue.id);
        }

        // Create collections - each with a different facet value filter
        for (let i = 0; i < NUM_COLLECTIONS; i++) {
            await adminClient.query<
                Codegen.CreateCollectionMutation,
                Codegen.CreateCollectionMutationVariables
            >(CREATE_COLLECTION, {
                input: {
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: `Benchmark Collection ${i}`,
                            slug: `benchmark-collection-${i}`,
                            description: `Collection ${i} for N+1 benchmark`,
                        },
                    ],
                    filters: [
                        {
                            code: facetValueCollectionFilter.code,
                            arguments: [
                                { name: 'facetValueIds', value: `["${facetValueIds[i]}"]` },
                                { name: 'containsAny', value: 'false' },
                            ],
                        },
                    ],
                },
            });
            await awaitRunningJobs(adminClient);
        }
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('should not have N+1 queries when fetching collections with productVariants totalItems', async () => {
        // Clear any previous query recordings
        queryLogger.clearQueries();

        // Start recording
        queryLogger.startRecording();

        // Execute the query that fetches collections with productVariants { totalItems }
        const result = await adminClient.query(GET_COLLECTIONS_WITH_PRODUCT_VARIANT_COUNT, {
            options: {
                take: NUM_COLLECTIONS + 1, // +1 for root collection
            },
        });

        // Stop recording
        const recordedQueries = queryLogger.stopRecording();

        // Basic assertions
        expect(result.collections.items.length).toBeGreaterThan(NUM_COLLECTIONS);
        expect(result.collections.totalItems).toBeGreaterThan(NUM_COLLECTIONS);

        // Analyze query patterns
        const selectQueries = recordedQueries.filter(q =>
            q.query.startsWith('SELECT') && !q.query.includes('PRAGMA'),
        );

        // Log results for analysis
        console.log('\n=== N+1 Query Benchmark Results ===');
        console.log(`Total collections in response: ${result.collections.items.length}`);
        console.log(`Total SQL queries executed: ${recordedQueries.length}`);
        console.log(`SELECT queries executed: ${selectQueries.length}`);

        // Group queries by pattern (normalize parameters)
        const queryPatterns = new Map<string, number>();
        for (const { query } of selectQueries) {
            // Normalize the query by removing specific parameter values
            const normalizedQuery = query
                .replace(/= \?/g, '= ?')
                .replace(/IN \([^)]+\)/g, 'IN (?)')
                .replace(/\d+/g, 'N');
            queryPatterns.set(normalizedQuery, (queryPatterns.get(normalizedQuery) || 0) + 1);
        }

        console.log('\nQuery patterns (normalized):');
        for (const [pattern, count] of queryPatterns.entries()) {
            console.log(`  [${count}x] ${pattern.substring(0, 100)}...`);
        }

        // Log full queries grouped by pattern for detailed analysis
        console.log('\n=== FULL QUERIES BY PATTERN ===');
        const seenPatterns = new Set<string>();
        for (const { query, parameters } of selectQueries) {
            const normalizedQuery = query
                .replace(/= \?/g, '= ?')
                .replace(/IN \([^)]+\)/g, 'IN (?)')
                .replace(/\d+/g, 'N');

            if (!seenPatterns.has(normalizedQuery)) {
                seenPatterns.add(normalizedQuery);
                const count = queryPatterns.get(normalizedQuery) || 1;
                console.log(`\n--- Pattern (${count}x) ---`);
                console.log('FULL SQL:');
                console.log(query);
                if (parameters && parameters.length > 0) {
                    console.log('PARAMS:', JSON.stringify(parameters));
                }
            }
        }

        // Detect potential N+1 issues
        const potentialN1Issues: string[] = [];
        for (const [pattern, count] of queryPatterns.entries()) {
            if (count > 2 && count >= NUM_COLLECTIONS * 0.5) {
                potentialN1Issues.push(`Pattern executed ${count} times (likely N+1): ${pattern.substring(0, 80)}...`);
            }
        }

        if (potentialN1Issues.length > 0) {
            console.log('\n!!! POTENTIAL N+1 ISSUES DETECTED !!!');
            for (const issue of potentialN1Issues) {
                console.log(`  - ${issue}`);
            }
        }

        // Calculate expected vs actual
        // Optimized: ~4 queries (collections list + ids + count + batch variant counts)
        // N+1 (bad): 1 query for collections list + N queries for productVariant counts per collection
        const optimizedQueryCount = 4;
        const n1QueryCount = NUM_COLLECTIONS + 3;

        console.log(`\nExpected query count (optimized): ~${optimizedQueryCount}`);
        console.log(`Expected query count (N+1): ~${n1QueryCount}`);
        console.log(`Actual query count: ${selectQueries.length}`);

        // Determine if we have an N+1 issue
        const hasN1Issue = selectQueries.length > optimizedQueryCount + 5; // some tolerance
        console.log(`\nN+1 issue detected: ${hasN1Issue ? 'YES' : 'NO'}`);

        // Calculate N+1 ratio: queries per collection
        const queriesPerCollection = selectQueries.length / result.collections.items.length;
        console.log(`Queries per collection: ${queriesPerCollection.toFixed(2)}`);
        console.log(`(Ideal is close to 0.2-0.5 with proper batching)\n`);

        // Assert that we don't have an N+1 issue
        expect(hasN1Issue).toBe(false);

        // Assert a reasonable query count - should be ~4 queries with proper batching
        // Allow some headroom for future changes but catch N+1 regressions
        expect(selectQueries.length).toBeLessThan(10);

        // The queries per collection ratio should be well below 1 (no N+1)
        expect(queriesPerCollection).toBeLessThan(1);
    });

    it('should not batch-fetch variant counts when productVariants.totalItems is not requested', async () => {
        // Test 1: No productVariants at all
        queryLogger.clearQueries();
        queryLogger.startRecording();

        const GET_COLLECTIONS_WITHOUT_VARIANTS = gql`
            query GetCollectionsWithoutVariants($options: CollectionListOptions) {
                collections(options: $options) {
                    items {
                        id
                        name
                    }
                    totalItems
                }
            }
        `;

        await adminClient.query(GET_COLLECTIONS_WITHOUT_VARIANTS, {
            options: { take: NUM_COLLECTIONS + 1 },
        });

        let recordedQueries = queryLogger.stopRecording();
        let selectQueries = recordedQueries.filter(q =>
            q.query.startsWith('SELECT') && !q.query.includes('PRAGMA'),
        );
        let batchCountQueries = selectQueries.filter(q =>
            q.query.includes('GROUP BY') && q.query.includes('product_variant'),
        );

        console.log(`\nQueries without productVariants: ${selectQueries.length}`);
        expect(batchCountQueries.length).toBe(0);

        // Test 2: productVariants.items requested but NOT totalItems
        queryLogger.clearQueries();
        queryLogger.startRecording();

        const GET_COLLECTIONS_WITH_VARIANT_ITEMS_ONLY = gql`
            query GetCollectionsWithVariantItemsOnly($options: CollectionListOptions) {
                collections(options: $options) {
                    items {
                        id
                        name
                        productVariants(options: { take: 1 }) {
                            items {
                                id
                            }
                        }
                    }
                    totalItems
                }
            }
        `;

        await adminClient.query(GET_COLLECTIONS_WITH_VARIANT_ITEMS_ONLY, {
            options: { take: 5 },
        });

        recordedQueries = queryLogger.stopRecording();
        selectQueries = recordedQueries.filter(q =>
            q.query.startsWith('SELECT') && !q.query.includes('PRAGMA'),
        );
        batchCountQueries = selectQueries.filter(q =>
            q.query.includes('GROUP BY') && q.query.includes('product_variant'),
        );

        console.log(`Queries with productVariants.items only: ${selectQueries.length}`);
        console.log(`Batch count queries found: ${batchCountQueries.length}`);

        // Should NOT have batch count query since totalItems wasn't requested
        expect(batchCountQueries.length).toBe(0);
    });

    it.skip('logs individual queries for detailed analysis', async () => {
        queryLogger.clearQueries();
        queryLogger.startRecording();

        await adminClient.query(GET_COLLECTIONS_WITH_PRODUCT_VARIANT_COUNT, {
            options: {
                take: 5, // Smaller set for detailed logging
            },
        });

        const recordedQueries = queryLogger.stopRecording();

        console.log('\n=== Detailed Query Log (first 5 collections) ===');
        const selectQueries = recordedQueries.filter(q =>
            q.query.startsWith('SELECT') && !q.query.includes('PRAGMA'),
        );

        for (let i = 0; i < Math.min(selectQueries.length, 30); i++) {
            const { query, parameters } = selectQueries[i];
            console.log(`\n--- Query ${i + 1} ---`);
            console.log(`SQL: ${query.substring(0, 200)}${query.length > 200 ? '...' : ''}`);
            if (parameters && parameters.length > 0) {
                console.log(`Params: ${JSON.stringify(parameters).substring(0, 100)}`);
            }
        }

        if (selectQueries.length > 30) {
            console.log(`\n... and ${selectQueries.length - 30} more queries`);
        }

        // Just a basic sanity check
        expect(selectQueries.length).toBeGreaterThan(0);
    });
});
