/**
 * @description
 * NestJS module for high-performance API infrastructure.
 * Provides Fastify, Mercurius, and DataLoader integration.
 *
 * @since 3.7.0
 */

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';

import { PrismaOrmModule } from '../service/prisma-orm.module';

import { DataLoaderService } from './dataloader/dataloader.service';
import { MercuriusConfigService } from './mercurius-config';

@Module({
    imports: [
        // Import Prisma ORM module for adapters
        PrismaOrmModule,

        // GraphQL with Mercurius
        GraphQLModule.forRootAsync<MercuriusDriverConfig>({
            driver: MercuriusDriver,
            imports: [ApiPerformanceModule],
            useFactory: (mercuriusConfig: MercuriusConfigService) => {
                return mercuriusConfig.createGqlOptions();
            },
            inject: [MercuriusConfigService],
        }),
    ],
    providers: [
        // GraphQL configuration
        {
            provide: MercuriusConfigService,
            useFactory: () => {
                return new MercuriusConfigService({
                    enablePlayground: process.env.NODE_ENV !== 'production',
                    enableIntrospection: process.env.NODE_ENV !== 'production',
                    enableBatching: true,
                    queryComplexityLimit: Number(process.env.GRAPHQL_QUERY_COMPLEXITY_LIMIT) || 1000,
                    queryDepthLimit: Number(process.env.GRAPHQL_QUERY_DEPTH_LIMIT) || 10,
                    enableCache: true,
                    cacheTtl: Number(process.env.GRAPHQL_CACHE_TTL) || 300,
                    enableSubscriptions: true,
                    path: '/shop-api',
                });
            },
        },

        // DataLoader for N+1 optimization
        DataLoaderService,
    ],
    exports: [MercuriusConfigService, DataLoaderService],
})
export class ApiPerformanceModule {}

/**
 * Usage in main.ts:
 *
 * import { NestFactory } from '@nestjs/core';
 * import { NestFastifyApplication } from '@nestjs/platform-fastify';
 * import { createFastifyAdapter } from './api/fastify-adapter';
 * import { AppModule } from './app.module';
 *
 * async function bootstrap() {
 *   const fastifyAdapter = createFastifyAdapter({
 *     enableCompression: true,
 *     enableSecurity: true,
 *     enableCors: true,
 *   });
 *
 *   const app = await NestFactory.create<NestFastifyApplication>(
 *     AppModule,
 *     fastifyAdapter,
 *   );
 *
 *   await app.listen(3000, '0.0.0.0');
 * }
 *
 * bootstrap();
 */
