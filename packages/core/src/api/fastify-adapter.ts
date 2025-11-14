/**
 * @description
 * Fastify platform adapter configuration for NestJS.
 * Replaces Express with Fastify for 2-3x performance improvement.
 *
 * @since 3.7.0
 */

import compress from '@fastify/compress';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastify, FastifyInstance, FastifyServerOptions } from 'fastify';

export interface FastifyConfig {
    /**
     * Enable compression (gzip/deflate/brotli)
     */
    enableCompression?: boolean;

    /**
     * Enable security headers (helmet)
     */
    enableSecurity?: boolean;

    /**
     * Enable CORS
     */
    enableCors?: boolean;

    /**
     * Body size limit (default: 1mb)
     */
    bodyLimit?: number;

    /**
     * Request timeout in milliseconds (default: 30s)
     */
    requestTimeout?: number;

    /**
     * Keep-alive timeout in milliseconds (default: 5s)
     */
    keepAliveTimeout?: number;

    /**
     * Logger configuration
     */
    logger?: boolean | object;

    /**
     * Trust proxy headers
     */
    trustProxy?: boolean;
}

export class VendureFastifyAdapter {
    private readonly fastifyInstance: FastifyInstance;
    private readonly adapter: FastifyAdapter;

    constructor(config: FastifyConfig = {}) {
        const {
            enableCompression = true,
            enableSecurity = true,
            enableCors = true,
            bodyLimit = 1048576, // 1MB
            requestTimeout = 30000, // 30s
            keepAliveTimeout = 5000, // 5s
            logger = false,
            trustProxy = false,
        } = config;

        // Fastify options optimized for performance
        const fastifyOptions: FastifyServerOptions = {
            logger,
            bodyLimit,
            requestTimeout,
            keepAliveTimeout,
            trustProxy,
            // Disable request logging for better performance
            disableRequestLogging: !logger,
            // Ignore trailing slash for consistent routing
            ignoreTrailingSlash: true,
            // Case-insensitive routing
            caseSensitive: false,
            // Request ID generation
            requestIdHeader: 'x-request-id',
            requestIdLogLabel: 'reqId',
            genReqId: () => this.generateRequestId(),
        };

        // Create Fastify instance
        this.fastifyInstance = fastify(fastifyOptions);

        // Register plugins asynchronously
        if (enableCompression) {
            void this.registerCompression();
        }

        if (enableSecurity) {
            void this.registerSecurity();
        }

        if (enableCors) {
            void this.registerCors();
        }

        // Create NestJS adapter
        this.adapter = new FastifyAdapter(this.fastifyInstance);
    }

    /**
     * Get the NestJS Fastify adapter
     */
    getAdapter(): FastifyAdapter {
        return this.adapter;
    }

    /**
     * Get the raw Fastify instance
     */
    getInstance(): FastifyInstance {
        return this.fastifyInstance;
    }

    /**
     * Register compression plugin
     */
    private async registerCompression(): Promise<void> {
        await this.fastifyInstance.register(compress, {
            global: true,
            threshold: 1024, // Only compress responses > 1KB
            encodings: ['gzip', 'deflate', 'br'],
            // Brotli for best compression, gzip for compatibility
            zlibOptions: {
                level: 6, // Balance between speed and compression
            },
        });
    }

    /**
     * Register security headers plugin
     */
    private async registerSecurity(): Promise<void> {
        await this.fastifyInstance.register(helmet, {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                },
            },
            // Allow embedding in iframe for admin panel
            frameguard: {
                action: 'sameorigin',
            },
        });
    }

    /**
     * Register CORS plugin
     */
    private async registerCors(): Promise<void> {
        await this.fastifyInstance.register(cors, {
            origin: true, // Reflect request origin
            credentials: true, // Allow cookies
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            exposedHeaders: ['X-Total-Count'],
            maxAge: 86400, // 24 hours
        });
    }

    /**
     * Generate unique request ID
     */
    private generateRequestId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Configure graceful shutdown
     */
    enableGracefulShutdown(app: NestFastifyApplication): void {
        // Handle shutdown signals
        const signals = ['SIGTERM', 'SIGINT'];

        signals.forEach(signal => {
            process.on(signal, () => {
                void (async () => {
                    // eslint-disable-next-line no-console
                    console.log(`Received ${signal}, starting graceful shutdown...`);

                    try {
                        // Close the application
                        await app.close();
                        // eslint-disable-next-line no-console
                        console.log('Application closed successfully');
                        process.exit(0);
                    } catch (error) {
                        // eslint-disable-next-line no-console
                        console.error('Error during shutdown:', error);
                        process.exit(1);
                    }
                })();
            });
        });
    }

    /**
     * Add custom Fastify plugins
     */
    async registerPlugin(plugin: any, options?: any): Promise<void> {
        await this.fastifyInstance.register(plugin, options);
    }

    /**
     * Get performance metrics
     */
    getMetrics(): {
        uptime: number;
        memoryUsage: NodeJS.MemoryUsage;
        cpuUsage: NodeJS.CpuUsage;
    } {
        return {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
        };
    }
}

/**
 * Factory function to create Fastify adapter
 */
export function createFastifyAdapter(config?: FastifyConfig): FastifyAdapter {
    const vendureFastifyAdapter = new VendureFastifyAdapter(config);
    return vendureFastifyAdapter.getAdapter();
}
