/**
 * @description
 * Benchmark tool for comparing Express vs Fastify performance.
 * Measures HTTP and GraphQL performance improvements.
 *
 * Usage:
 *   npm run benchmark:fastify
 *
 * @since 3.7.0
 */

/* eslint-disable no-console */

import http from 'http';
import { performance } from 'perf_hooks';

export interface BenchmarkResult {
    framework: 'Express' | 'Fastify';
    test: string;
    requests: number;
    duration: number;
    requestsPerSecond: number;
    avgLatency: number;
    minLatency: number;
    maxLatency: number;
    memoryUsage: number;
}

export interface HttpBenchmarkOptions {
    url: string;
    method?: 'GET' | 'POST';
    body?: any;
    headers?: Record<string, string>;
    requests?: number;
    concurrency?: number;
}

export class FastifyBenchmark {
    private results: BenchmarkResult[] = [];

    /**
     * Run HTTP benchmark
     */
    async runHttpBenchmark(
        framework: 'Express' | 'Fastify',
        options: HttpBenchmarkOptions,
    ): Promise<BenchmarkResult> {
        const { url, method = 'GET', body, headers = {}, requests = 10000, concurrency = 100 } = options;

        const latencies: number[] = [];
        let completed = 0;
        const startTime = performance.now();
        const startMemory = process.memoryUsage().heapUsed;

        // Run requests with concurrency
        const batchSize = Math.ceil(requests / concurrency);
        const batches: Array<Promise<void>> = [];

        for (let i = 0; i < concurrency; i++) {
            const batch = this.runRequestBatch(url, method, body, headers, batchSize, latencies);
            batches.push(batch);
        }

        await Promise.all(batches);
        completed = requests;

        const endTime = performance.now();
        const endMemory = process.memoryUsage().heapUsed;
        const duration = endTime - startTime;

        const result: BenchmarkResult = {
            framework,
            test: `${method} ${url}`,
            requests: completed,
            duration,
            requestsPerSecond: (completed / duration) * 1000,
            avgLatency: latencies.reduce((a, b) => a + b, 0) / latencies.length,
            minLatency: Math.min(...latencies),
            maxLatency: Math.max(...latencies),
            memoryUsage: endMemory - startMemory,
        };

        this.results.push(result);
        return result;
    }

    /**
     * Run batch of HTTP requests
     */
    private async runRequestBatch(
        url: string,
        method: string,
        body: any,
        headers: Record<string, string>,
        count: number,
        latencies: number[],
    ): Promise<void> {
        for (let i = 0; i < count; i++) {
            const start = performance.now();

            try {
                await this.makeRequest(url, method, body, headers);
                const end = performance.now();
                latencies.push(end - start);
            } catch (error) {
                console.error('Request failed:', error);
            }
        }
    }

    /**
     * Make HTTP request
     */
    private makeRequest(
        url: string,
        method: string,
        body: any,
        headers: Record<string, string>,
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || 80,
                path: parsedUrl.pathname + parsedUrl.search,
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            };

            const req = http.request(options, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve();
                });
            });

            req.on('error', reject);

            if (body && method === 'POST') {
                req.write(JSON.stringify(body));
            }

            req.end();
        });
    }

    /**
     * Compare Express vs Fastify
     */
    async compare(
        expressUrl: string,
        fastifyUrl: string,
        options: Omit<HttpBenchmarkOptions, 'url'> = {},
    ): Promise<void> {
        console.log('\n🚀 Fastify vs Express Benchmark\n');
        console.log('═'.repeat(70));

        // Warm up
        console.log('\n🔥 Warming up...');
        await this.runHttpBenchmark('Express', { ...options, url: expressUrl, requests: 100 });
        await this.runHttpBenchmark('Fastify', { ...options, url: fastifyUrl, requests: 100 });
        this.results = []; // Clear warm-up results

        // Run actual benchmarks
        console.log('\n📊 Running benchmarks...\n');

        console.log('Testing Express...');
        const expressResult = await this.runHttpBenchmark('Express', {
            ...options,
            url: expressUrl,
        });
        console.log(`✓ Express: ${expressResult.requestsPerSecond.toFixed(0)} req/s`);

        console.log('\nTesting Fastify...');
        const fastifyResult = await this.runHttpBenchmark('Fastify', {
            ...options,
            url: fastifyUrl,
        });
        console.log(`✓ Fastify: ${fastifyResult.requestsPerSecond.toFixed(0)} req/s`);

        // Calculate improvement
        const speedup =
            ((fastifyResult.requestsPerSecond - expressResult.requestsPerSecond) /
                expressResult.requestsPerSecond) *
            100;

        console.log('\n' + '═'.repeat(70));
        console.log('\n📈 Results:\n');
        console.log(`  Express:  ${expressResult.requestsPerSecond.toFixed(0)} req/s`);
        console.log(`  Fastify:  ${fastifyResult.requestsPerSecond.toFixed(0)} req/s`);
        console.log(
            `  ${speedup > 0 ? '🏆' : '⚠️'}  Fastify is ${Math.abs(speedup).toFixed(1)}% ${speedup > 0 ? 'faster' : 'slower'}`,
        );
        const expressLatency = expressResult.avgLatency.toFixed(2);
        const fastifyLatency = fastifyResult.avgLatency.toFixed(2);
        const expressMemory = (expressResult.memoryUsage / 1024 / 1024).toFixed(2);
        const fastifyMemory = (fastifyResult.memoryUsage / 1024 / 1024).toFixed(2);

        console.log(`\n  Latency (avg):`);
        console.log(`    Express: ${expressLatency}ms`);
        console.log(`    Fastify: ${fastifyLatency}ms`);
        console.log(`\n  Memory usage:`);
        console.log(`    Express: ${expressMemory}MB`);
        console.log(`    Fastify: ${fastifyMemory}MB`);
        console.log('\n' + '═'.repeat(70) + '\n');
    }

    /**
     * Run GraphQL benchmark
     */
    async benchmarkGraphQL(
        framework: 'Express + Apollo' | 'Fastify + Mercurius',
        url: string,
        query: string,
        variables?: any,
    ): Promise<BenchmarkResult> {
        return this.runHttpBenchmark(framework as any, {
            url,
            method: 'POST',
            body: {
                query,
                variables,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Compare GraphQL performance
     */
    async compareGraphQL(
        expressUrl: string,
        fastifyUrl: string,
        query: string,
        variables?: any,
    ): Promise<void> {
        console.log('\n🚀 GraphQL Benchmark: Apollo Server vs Mercurius\n');
        console.log('═'.repeat(70));

        // Warm up
        console.log('\n🔥 Warming up...');
        await this.benchmarkGraphQL('Express + Apollo', expressUrl, query, variables);
        await this.benchmarkGraphQL('Fastify + Mercurius', fastifyUrl, query, variables);
        this.results = [];

        // Run benchmarks
        console.log('\n📊 Running benchmarks...\n');

        console.log('Testing Apollo Server...');
        const apolloResult = await this.benchmarkGraphQL('Express + Apollo', expressUrl, query, variables);
        console.log(`✓ Apollo:    ${apolloResult.requestsPerSecond.toFixed(0)} req/s`);

        console.log('\nTesting Mercurius...');
        const mercuriusResult = await this.benchmarkGraphQL(
            'Fastify + Mercurius',
            fastifyUrl,
            query,
            variables,
        );
        console.log(`✓ Mercurius: ${mercuriusResult.requestsPerSecond.toFixed(0)} req/s`);

        // Calculate improvement
        const speedup =
            ((mercuriusResult.requestsPerSecond - apolloResult.requestsPerSecond) /
                apolloResult.requestsPerSecond) *
            100;

        console.log('\n' + '═'.repeat(70));
        console.log('\n📈 Results:\n');
        console.log(`  Apollo Server: ${apolloResult.requestsPerSecond.toFixed(0)} req/s`);
        console.log(`  Mercurius:     ${mercuriusResult.requestsPerSecond.toFixed(0)} req/s`);
        console.log(
            `  ${speedup > 0 ? '🏆' : '⚠️'}  Mercurius is ${Math.abs(speedup).toFixed(1)}% ${speedup > 0 ? 'faster' : 'slower'}`,
        );
        console.log(
            `\n  Latency (avg):\n    Apollo:    ${apolloResult.avgLatency.toFixed(2)}ms\n    Mercurius: ${mercuriusResult.avgLatency.toFixed(2)}ms`,
        );
        console.log('\n' + '═'.repeat(70) + '\n');
    }

    /**
     * Generate detailed report
     */
    generateReport(): string {
        const lines: string[] = [];

        lines.push('\n╔═══════════════════════════════════════════════════════════╗');
        lines.push('║        FASTIFY VS EXPRESS BENCHMARK REPORT                ║');
        lines.push('╚═══════════════════════════════════════════════════════════╝\n');

        for (const result of this.results) {
            lines.push(`\n📋 ${result.framework} - ${result.test}`);
            lines.push('─'.repeat(60));
            lines.push(`  Requests:          ${result.requests}`);
            lines.push(`  Duration:          ${result.duration.toFixed(2)}ms`);
            lines.push(`  Req/s:             ${result.requestsPerSecond.toFixed(0)}`);
            lines.push(`  Avg Latency:       ${result.avgLatency.toFixed(2)}ms`);
            lines.push(`  Min Latency:       ${result.minLatency.toFixed(2)}ms`);
            lines.push(`  Max Latency:       ${result.maxLatency.toFixed(2)}ms`);
            lines.push(`  Memory Usage:      ${(result.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
        }

        lines.push('\n');
        return lines.join('\n');
    }

    /**
     * Export results as JSON
     */
    exportJson(): string {
        return JSON.stringify(
            {
                timestamp: new Date().toISOString(),
                results: this.results,
            },
            null,
            2,
        );
    }
}

/**
 * Example usage:
 *
 * const benchmark = new FastifyBenchmark();
 *
 * // HTTP comparison
 * await benchmark.compare(
 *   'http://localhost:3000/api/products',
 *   'http://localhost:3001/api/products',
 *   { requests: 10000, concurrency: 100 }
 * );
 *
 * // GraphQL comparison
 * await benchmark.compareGraphQL(
 *   'http://localhost:3000/graphql',
 *   'http://localhost:3001/graphql',
 *   '{ products { id name } }'
 * );
 */
