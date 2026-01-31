/**
 * Range buckets for anonymizing entity counts
 */
export type RangeBucket = '0' | '1-100' | '101-1k' | '1k-10k' | '10k-100k' | '100k+';

/**
 * Information about plugins used in the Vendure installation
 */
export interface TelemetryPluginInfo {
    /** Names of npm packages (official Vendure plugins) */
    npm: string[];
    /** Count of custom plugins (names are NOT collected for privacy) */
    customCount: number;
}

/**
 * Entity count metrics using range buckets for privacy
 */
export interface TelemetryEntityMetrics {
    entities: {
        product?: RangeBucket;
        order?: RangeBucket;
        customer?: RangeBucket;
        productVariant?: RangeBucket;
    };
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
    ci?: boolean;
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
    databaseType: 'postgres' | 'mysql' | 'mariadb' | 'sqlite';

    // Optional fields
    environment?: string;
    platform?: string;
    plugins?: TelemetryPluginInfo;
    metrics?: TelemetryEntityMetrics;
    deployment?: TelemetryDeployment;
    config?: TelemetryConfig;
}
