import { DataSourceOptions } from 'typeorm';

/**
 * Range buckets for anonymizing entity counts
 */
export type RangeBucket = '0' | '1-100' | '101-1k' | '1k-10k' | '10k-100k' | '100k+';

/**
 * Supported database types for Vendure telemetry.
 * Derived from TypeORM's DataSourceOptions for type safety.
 * Note: 'better-sqlite3' is normalized to 'sqlite' in the collector.
 */
export type SupportedDatabaseType =
    | Extract<DataSourceOptions['type'], 'postgres' | 'mysql' | 'mariadb' | 'sqlite'>
    | 'other';

/**
 * Information about plugins used in the Vendure installation
 */
export interface TelemetryPluginInfo {
    /** Names of detected npm packages (official Vendure and third-party plugins) */
    npm: string[];
    /** Count of custom plugins (names are NOT collected for privacy) */
    customCount: number;
}

/**
 * Entity count metrics using range buckets for privacy
 */
export interface TelemetryEntityMetrics {
    entities: Partial<Record<string, RangeBucket>>;
    custom: {
        entityCount: number;
        totalRecords?: RangeBucket;
    };
}

/**
 * Deployment environment information
 */
export interface TelemetryDeployment {
    containerized?: boolean;
    cloudProvider?: string;
    workerMode?: 'integrated' | 'separate';
    serverless?: boolean;
}

/**
 * Configuration snapshot (strategy class names only, no sensitive data)
 */
export interface TelemetryConfig {
    assetStorageType?: string;
    jobQueueType?: string;
    entityIdStrategy?: string;
    defaultLanguage?: string;
    customFieldsCount?: number;
    authenticationMethods?: string[];
}

/**
 * Full telemetry payload sent to the collection endpoint
 */
export interface TelemetryPayload {
    // Required fields
    installationId: string;
    timestamp: string;
    vendureVersion: string;
    nodeVersion: string;
    databaseType: SupportedDatabaseType;

    // Optional fields
    environment?: string;
    platform?: string;
    plugins?: TelemetryPluginInfo;
    metrics?: TelemetryEntityMetrics;
    deployment?: TelemetryDeployment;
    config?: TelemetryConfig;
}
