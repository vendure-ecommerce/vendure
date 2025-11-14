/**
 * @description
 * Performance benchmarking tool for ORM comparison.
 * Compares Prisma vs TypeORM performance across various operations.
 *
 * Usage:
 *   npm run benchmark:orm
 *
 * @since 3.6.0
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { performance } from 'perf_hooks';

export interface BenchmarkResult {
    operation: string;
    orm: 'Prisma' | 'TypeORM';
    iterations: number;
    totalTime: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
    throughput: number; // operations per second
}

export interface BenchmarkComparison {
    operation: string;
    prismaAvg: number;
    typeormAvg: number;
    difference: number; // percentage difference
    winner: 'Prisma' | 'TypeORM' | 'Tie';
}

export class OrmBenchmark {
    private results: BenchmarkResult[] = [];

    /**
     * Run a benchmark for a specific operation
     */
    async runBenchmark(
        name: string,
        orm: 'Prisma' | 'TypeORM',
        operation: () => Promise<void>,
        iterations: number = 100,
    ): Promise<BenchmarkResult> {
        const times: number[] = [];

        // Warm-up run
        await operation();

        // Actual benchmark runs
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await operation();
            const end = performance.now();
            times.push(end - start);
        }

        const totalTime = times.reduce((sum, time) => sum + time, 0);
        const averageTime = totalTime / iterations;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        const throughput = 1000 / averageTime; // ops/second

        const result: BenchmarkResult = {
            operation: name,
            orm,
            iterations,
            totalTime,
            averageTime,
            minTime,
            maxTime,
            throughput,
        };

        this.results.push(result);
        return result;
    }

    /**
     * Compare Prisma vs TypeORM for the same operation
     */
    async compareBenchmarks(
        operationName: string,
        prismaOp: () => Promise<void>,
        typeormOp: () => Promise<void>,
        iterations: number = 100,
    ): Promise<BenchmarkComparison> {
        console.log(`\n📊 Benchmarking: ${operationName}`);
        console.log('━'.repeat(60));

        const prismaResult = await this.runBenchmark(operationName, 'Prisma', prismaOp, iterations);
        console.log(`✓ Prisma:  ${prismaResult.averageTime.toFixed(2)}ms avg`);

        const typeormResult = await this.runBenchmark(operationName, 'TypeORM', typeormOp, iterations);
        console.log(`✓ TypeORM: ${typeormResult.averageTime.toFixed(2)}ms avg`);

        const difference =
            ((prismaResult.averageTime - typeormResult.averageTime) / typeormResult.averageTime) * 100;

        let winner: 'Prisma' | 'TypeORM' | 'Tie';
        if (Math.abs(difference) < 5) {
            winner = 'Tie';
        } else if (prismaResult.averageTime < typeormResult.averageTime) {
            winner = 'Prisma';
        } else {
            winner = 'TypeORM';
        }

        console.log(
            `🏆 Winner: ${winner} ${winner !== 'Tie' ? `(${Math.abs(difference).toFixed(1)}% faster)` : ''}`,
        );

        return {
            operation: operationName,
            prismaAvg: prismaResult.averageTime,
            typeormAvg: typeormResult.averageTime,
            difference,
            winner,
        };
    }

    /**
     * Generate detailed report
     */
    generateReport(): string {
        const lines: string[] = [];

        lines.push('\n╔═══════════════════════════════════════════════════════════╗');
        lines.push('║           ORM PERFORMANCE BENCHMARK REPORT                ║');
        lines.push('╚═══════════════════════════════════════════════════════════╝\n');

        // Group by operation
        const byOperation = new Map<string, BenchmarkResult[]>();
        for (const result of this.results) {
            if (!byOperation.has(result.operation)) {
                byOperation.set(result.operation, []);
            }
            byOperation.get(result.operation)!.push(result);
        }

        // Print each operation
        for (const [operation, results] of byOperation) {
            lines.push(`\n📋 ${operation}`);
            lines.push('─'.repeat(60));

            for (const result of results) {
                lines.push(`\n  ${result.orm}:`);
                lines.push(`    Iterations:    ${result.iterations}`);
                lines.push(`    Total Time:    ${result.totalTime.toFixed(2)}ms`);
                lines.push(`    Average Time:  ${result.averageTime.toFixed(2)}ms`);
                lines.push(`    Min Time:      ${result.minTime.toFixed(2)}ms`);
                lines.push(`    Max Time:      ${result.maxTime.toFixed(2)}ms`);
                lines.push(`    Throughput:    ${result.throughput.toFixed(2)} ops/sec`);
            }

            // Calculate comparison
            if (results.length === 2) {
                const [first, second] = results;
                const diff = ((first.averageTime - second.averageTime) / second.averageTime) * 100;
                const faster = diff < 0 ? first.orm : second.orm;
                const slower = diff < 0 ? second.orm : first.orm;

                if (Math.abs(diff) < 5) {
                    lines.push(
                        `\n  ⚖️  Performance is essentially equal (${Math.abs(diff).toFixed(1)}% difference)`,
                    );
                } else {
                    lines.push(`\n  🏆 ${faster} is ${Math.abs(diff).toFixed(1)}% faster than ${slower}`);
                }
            }
        }

        // Summary
        lines.push('\n\n╔═══════════════════════════════════════════════════════════╗');
        lines.push('║                        SUMMARY                            ║');
        lines.push('╚═══════════════════════════════════════════════════════════╝\n');

        const prismaResults = this.results.filter(r => r.orm === 'Prisma');
        const typeormResults = this.results.filter(r => r.orm === 'TypeORM');

        if (prismaResults.length > 0) {
            const prismaAvg = prismaResults.reduce((sum, r) => sum + r.averageTime, 0) / prismaResults.length;
            lines.push(`  Prisma Average:  ${prismaAvg.toFixed(2)}ms`);
        }

        if (typeormResults.length > 0) {
            const typeormAvg =
                typeormResults.reduce((sum, r) => sum + r.averageTime, 0) / typeormResults.length;
            lines.push(`  TypeORM Average: ${typeormAvg.toFixed(2)}ms`);
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

    /**
     * Clear all results
     */
    clear(): void {
        this.results = [];
    }
}

/**
 * Example benchmark scenarios
 */
export class BenchmarkScenarios {
    static async runAllBenchmarks(): Promise<void> {
        const benchmark = new OrmBenchmark();

        console.log('\n🚀 Starting ORM Performance Benchmarks...\n');

        // Note: These are example operations
        // In real usage, you would inject actual adapters

        // Benchmark 1: Simple findOne operation
        await benchmark.compareBenchmarks(
            'Customer.findOne (with relations)',
            async () => {
                // Prisma findOne
                await new Promise(resolve => setTimeout(resolve, 1)); // Simulated
            },
            async () => {
                // TypeORM findOne
                await new Promise(resolve => setTimeout(resolve, 1.2)); // Simulated
            },
            50,
        );

        // Benchmark 2: FindAll with pagination
        await benchmark.compareBenchmarks(
            'Customer.findAll (50 items, paginated)',
            async () => {
                // Prisma findAll
                await new Promise(resolve => setTimeout(resolve, 3)); // Simulated
            },
            async () => {
                // TypeORM findAll
                await new Promise(resolve => setTimeout(resolve, 3.5)); // Simulated
            },
            50,
        );

        // Benchmark 3: Complex query with joins
        await benchmark.compareBenchmarks(
            'Order.findOne (with lines, payments, customer)',
            async () => {
                // Prisma complex query
                await new Promise(resolve => setTimeout(resolve, 5)); // Simulated
            },
            async () => {
                // TypeORM complex query
                await new Promise(resolve => setTimeout(resolve, 6)); // Simulated
            },
            30,
        );

        // Benchmark 4: Bulk insert
        await benchmark.compareBenchmarks(
            'Customer.create (bulk 100 records)',
            async () => {
                // Prisma bulk insert
                await new Promise(resolve => setTimeout(resolve, 15)); // Simulated
            },
            async () => {
                // TypeORM bulk insert
                await new Promise(resolve => setTimeout(resolve, 20)); // Simulated
            },
            10,
        );

        // Print report
        console.log(benchmark.generateReport());

        // Save JSON
        // fs.writeFileSync('benchmark-results.json', benchmark.exportJson());
    }
}

// Example usage:
// BenchmarkScenarios.runAllBenchmarks();
