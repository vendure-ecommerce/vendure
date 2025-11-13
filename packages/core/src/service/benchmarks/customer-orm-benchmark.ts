/**
 * @description
 * Performance benchmarks comparing TypeORM and Prisma ORM implementations.
 *
 * Run with: npm run bench
 *
 * NOTE: Requires Prisma Client to be generated and a test database.
 *
 * @since 3.6.0
 */

import { Bench } from 'tinybench';
import { CustomerPrismaAdapter } from '../adapters/customer-prisma.adapter';
import { CustomerTypeOrmAdapter } from '../adapters/customer-typeorm.adapter';

/**
 * Benchmark suite for Customer ORM operations
 */
export class CustomerOrmBenchmark {
    private bench: Bench;
    private prismaAdapter!: CustomerPrismaAdapter;
    private typeormAdapter!: CustomerTypeOrmAdapter;

    constructor() {
        this.bench = new Bench({ time: 1000 }); // Run each test for 1 second
    }

    /**
     * Setup adapters (requires real database connection)
     */
    async setup() {
        // This would initialize real adapters with database connections
        // For now, it's a placeholder
        console.log('Setting up benchmark environment...');
    }

    /**
     * Cleanup after benchmarks
     */
    async teardown() {
        console.log('Cleaning up benchmark environment...');
    }

    /**
     * Run all benchmarks and display results
     */
    async runAll() {
        await this.setup();

        // Benchmark: Find one customer
        this.bench.add('TypeORM - findOne', async () => {
            await this.typeormAdapter.findOne('test-customer-1');
        });

        this.bench.add('Prisma - findOne', async () => {
            await this.prismaAdapter.findOne('test-customer-1');
        });

        // Benchmark: Find many customers
        this.bench.add('TypeORM - findAll (20 items)', async () => {
            await this.typeormAdapter.findAll({ skip: 0, take: 20 });
        });

        this.bench.add('Prisma - findAll (20 items)', async () => {
            await this.prismaAdapter.findAll({ skip: 0, take: 20 });
        });

        // Benchmark: Search customers
        this.bench.add('TypeORM - search', async () => {
            await this.typeormAdapter.search('john');
        });

        this.bench.add('Prisma - search', async () => {
            await this.prismaAdapter.search('john');
        });

        // Benchmark: Create customer
        this.bench.add('TypeORM - create', async () => {
            await this.typeormAdapter.create({
                firstName: 'Test',
                lastName: 'User',
                emailAddress: `test-${Date.now()}@example.com`,
            });
        });

        this.bench.add('Prisma - create', async () => {
            await this.prismaAdapter.create({
                firstName: 'Test',
                lastName: 'User',
                emailAddress: `test-${Date.now()}@example.com`,
            });
        });

        // Benchmark: Update customer
        this.bench.add('TypeORM - update', async () => {
            await this.typeormAdapter.update('test-customer-1', {
                firstName: 'Updated',
            });
        });

        this.bench.add('Prisma - update', async () => {
            await this.prismaAdapter.update('test-customer-1', {
                firstName: 'Updated',
            });
        });

        // Run benchmarks
        await this.bench.run();

        // Display results
        this.displayResults();

        await this.teardown();
    }

    /**
     * Display benchmark results in a formatted table
     */
    private displayResults() {
        console.log('\n📊 Customer ORM Benchmark Results\n');
        console.log('=' .repeat(80));

        const tasks = this.bench.tasks;
        const grouped = new Map<string, typeof tasks>();

        // Group tasks by operation
        tasks.forEach(task => {
            const [orm, operation] = task.name.split(' - ');
            if (!grouped.has(operation)) {
                grouped.set(operation, []);
            }
            grouped.get(operation)!.push(task);
        });

        // Display comparison for each operation
        grouped.forEach((tasks, operation) => {
            console.log(`\n${operation}:`);
            console.log('-'.repeat(80));

            const typeormTask = tasks.find(t => t.name.startsWith('TypeORM'));
            const prismaTask = tasks.find(t => t.name.startsWith('Prisma'));

            if (typeormTask && prismaTask) {
                const typeormOps = typeormTask.result?.hz || 0;
                const prismaOps = prismaTask.result?.hz || 0;
                const improvement = ((prismaOps - typeormOps) / typeormOps) * 100;

                console.log(`TypeORM: ${typeormOps.toFixed(2)} ops/sec`);
                console.log(`Prisma:  ${prismaOps.toFixed(2)} ops/sec`);
                console.log(
                    `Improvement: ${improvement > 0 ? '+' : ''}${improvement.toFixed(2)}% ${
                        improvement > 0 ? '✅' : '⚠️'
                    }`,
                );
            }
        });

        console.log('\n' + '='.repeat(80));

        // Summary
        const allTypeormOps =
            tasks
                .filter(t => t.name.startsWith('TypeORM'))
                .reduce((sum, t) => sum + (t.result?.hz || 0), 0) / tasks.length;

        const allPrismaOps =
            tasks
                .filter(t => t.name.startsWith('Prisma'))
                .reduce((sum, t) => sum + (t.result?.hz || 0), 0) / tasks.length;

        const overallImprovement = ((allPrismaOps - allTypeormOps) / allTypeormOps) * 100;

        console.log('\n📈 Overall Performance:');
        console.log(`TypeORM Average: ${allTypeormOps.toFixed(2)} ops/sec`);
        console.log(`Prisma Average:  ${allPrismaOps.toFixed(2)} ops/sec`);
        console.log(
            `Overall Improvement: ${overallImprovement > 0 ? '+' : ''}${overallImprovement.toFixed(
                2,
            )}% ${overallImprovement > 0 ? '🚀' : '⚠️'}`,
        );

        console.log('\n' + '='.repeat(80) + '\n');
    }
}

/**
 * Run benchmarks if executed directly
 */
if (require.main === module) {
    const benchmark = new CustomerOrmBenchmark();
    benchmark.runAll().catch(console.error);
}
