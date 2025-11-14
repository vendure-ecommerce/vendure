/**
 * @description
 * Configuration service for Prisma ORM integration.
 * Manages feature flags and runtime configuration for dual ORM support.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';

export enum OrmMode {
    TYPEORM = 'typeorm',
    PRISMA = 'prisma',
}

@Injectable()
export class PrismaConfigService {
    private readonly enabled: boolean;
    private readonly ormMode: OrmMode;
    private readonly logQueries: boolean;
    private readonly enablePerformanceMetrics: boolean;

    constructor() {
        // Read from environment variables
        this.enabled = this.parseBoolean(process.env.VENDURE_ENABLE_PRISMA, false);
        this.ormMode = this.parseOrmMode(process.env.VENDURE_ORM_MODE, OrmMode.TYPEORM);
        this.logQueries = this.parseBoolean(process.env.VENDURE_PRISMA_LOG_QUERIES, false);
        this.enablePerformanceMetrics = this.parseBoolean(
            process.env.VENDURE_PRISMA_PERFORMANCE_METRICS,
            false,
        );
    }

    /**
     * Check if Prisma is enabled
     */
    isPrismaEnabled(): boolean {
        return this.enabled;
    }

    /**
     * Get current ORM mode
     */
    getOrmMode(): OrmMode {
        return this.ormMode;
    }

    /**
     * Check if using Prisma ORM
     */
    isUsingPrisma(): boolean {
        return this.enabled && this.ormMode === OrmMode.PRISMA;
    }

    /**
     * Check if using TypeORM
     */
    isUsingTypeOrm(): boolean {
        return !this.enabled || this.ormMode === OrmMode.TYPEORM;
    }

    /**
     * Check if query logging is enabled
     */
    shouldLogQueries(): boolean {
        return this.logQueries;
    }

    /**
     * Check if performance metrics are enabled
     */
    shouldCollectPerformanceMetrics(): boolean {
        return this.enablePerformanceMetrics;
    }

    /**
     * Get configuration summary
     */
    getConfigSummary(): {
        enabled: boolean;
        ormMode: string;
        logQueries: boolean;
        performanceMetrics: boolean;
    } {
        return {
            enabled: this.enabled,
            ormMode: this.ormMode,
            logQueries: this.logQueries,
            performanceMetrics: this.enablePerformanceMetrics,
        };
    }

    /**
     * Parse boolean from string
     */
    private parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
        if (value === undefined) {
            return defaultValue;
        }

        const normalized = value.toLowerCase().trim();
        return normalized === 'true' || normalized === '1' || normalized === 'yes';
    }

    /**
     * Parse ORM mode from string
     */
    private parseOrmMode(value: string | undefined, defaultValue: OrmMode): OrmMode {
        if (value === undefined) {
            return defaultValue;
        }

        const normalized = value.toLowerCase().trim();

        if (normalized === 'prisma') {
            return OrmMode.PRISMA;
        }

        if (normalized === 'typeorm') {
            return OrmMode.TYPEORM;
        }

        return defaultValue;
    }
}
