import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * @description
 * PrismaService provides a connection to the database using Prisma ORM.
 * This service is part of Phase 2 migration from TypeORM to Prisma.
 *
 * The service automatically handles:
 * - Connection on module initialization
 * - Disconnection on module destruction
 * - Query logging (in development)
 * - Error handling
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class CustomerService {
 *   constructor(private prisma: PrismaService) {}
 *
 *   async findOne(id: string) {
 *     return this.prisma.customer.findUnique({
 *       where: { id },
 *       include: { addresses: true },
 *     });
 *   }
 * }
 * ```
 *
 * @docsCategory services
 * @since 3.6.0
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const logLevel = process.env.PRISMA_LOG_QUERIES === 'true' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'];

        super({
            log: logLevel as any,
            errorFormat: 'pretty',
        });

        // Query logging for development
        if (process.env.NODE_ENV === 'development' || process.env.PRISMA_LOG_QUERIES === 'true') {
            this.setupQueryLogging();
        }
    }

    /**
     * Connect to database when module initializes
     */
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Prisma client connected successfully');
        } catch (error) {
            this.logger.error('Failed to connect to database via Prisma', error);
            throw error;
        }
    }

    /**
     * Disconnect from database when module is destroyed
     */
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('Prisma client disconnected');
        } catch (error) {
            this.logger.error('Error disconnecting Prisma client', error);
        }
    }

    /**
     * Setup query logging for development/debugging
     * @private
     */
    private setupQueryLogging() {
        // Type assertion needed as the types don't match perfectly
        const prisma = this as any;

        prisma.$on('query', (e: any) => {
            const duration = e.duration;
            const query = e.query;
            const params = e.params;

            // Warn on slow queries (>1000ms)
            if (duration > 1000) {
                this.logger.warn(`Slow query detected (${duration}ms): ${query}`);
            } else {
                this.logger.debug(`Query (${duration}ms): ${query}`);
            }

            if (params) {
                this.logger.debug(`Params: ${params}`);
            }
        });

        prisma.$on('error', (e: any) => {
            this.logger.error('Prisma error event', e);
        });

        prisma.$on('warn', (e: any) => {
            this.logger.warn('Prisma warning', e);
        });
    }

    /**
     * Execute a raw query (use sparingly, prefer Prisma Client API)
     * @param query - SQL query string
     * @param params - Query parameters
     */
    async executeRaw(query: string, ...params: any[]) {
        return this.$executeRawUnsafe(query, ...params);
    }

    /**
     * Query raw data (use sparingly, prefer Prisma Client API)
     * @param query - SQL query string
     * @param params - Query parameters
     */
    async queryRaw<T = any>(query: string, ...params: any[]): Promise<T> {
        return this.$queryRawUnsafe(query, ...params);
    }

    /**
     * Clean up test data (useful for E2E tests)
     * WARNING: This will delete all data from specified tables!
     */
    async cleanDatabase(tables?: string[]) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('cleanDatabase cannot be called in production!');
        }

        const tablesToClean = tables || [
            'customer',
            'address',
            'customer_group',
            'customer_group_membership',
            'customer_channel',
        ];

        this.logger.warn(`Cleaning database tables: ${tablesToClean.join(', ')}`);

        for (const table of tablesToClean) {
            await this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
        }
    }

    /**
     * Health check - verify database connection
     */
    async healthCheck(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            this.logger.error('Database health check failed', error);
            return false;
        }
    }
}
