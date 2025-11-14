/**
 * @description
 * NestJS module for Prisma ORM integration.
 * Provides all repositories, adapters, and configuration services.
 *
 * @since 3.6.0
 */

import { Module } from '@nestjs/common';

import { PrismaService } from '../connection/prisma.service';

import { AddressPrismaAdapter } from './adapters/address-prisma.adapter';
import { CollectionPrismaAdapter } from './adapters/collection-prisma.adapter';
import { CustomerPrismaAdapter } from './adapters/customer-prisma.adapter';
import { FacetPrismaAdapter } from './adapters/facet-prisma.adapter';
import { OrderPrismaAdapter } from './adapters/order-prisma.adapter';
import { OrmAdapterFactory } from './adapters/orm-adapter.factory';
import { ProductPrismaAdapter } from './adapters/product-prisma.adapter';
import { TaxRatePrismaAdapter } from './adapters/tax-rate-prisma.adapter';
import { PrismaConfigService } from './config/prisma-config.service';
import { AddressPrismaRepository } from './repositories/prisma/address-prisma.repository';
import { CollectionPrismaRepository } from './repositories/prisma/collection-prisma.repository';
import { CustomerPrismaRepository } from './repositories/prisma/customer-prisma.repository';
import { FacetPrismaRepository } from './repositories/prisma/facet-prisma.repository';
import { GlobalSettingsPrismaRepository } from './repositories/prisma/global-settings-prisma.repository';
import { OrderPrismaRepository } from './repositories/prisma/order-prisma.repository';
import { ProductPrismaRepository } from './repositories/prisma/product-prisma.repository';
import { SessionPrismaRepository } from './repositories/prisma/session-prisma.repository';
import { StockMovementPrismaRepository } from './repositories/prisma/stock-movement-prisma.repository';
import { TaxRatePrismaRepository } from './repositories/prisma/tax-rate-prisma.repository';

const repositories = [
    CustomerPrismaRepository,
    AddressPrismaRepository,
    ProductPrismaRepository,
    OrderPrismaRepository,
    TaxRatePrismaRepository,
    CollectionPrismaRepository,
    FacetPrismaRepository,
    StockMovementPrismaRepository,
    SessionPrismaRepository,
    GlobalSettingsPrismaRepository,
];

const adapters = [
    CustomerPrismaAdapter,
    AddressPrismaAdapter,
    ProductPrismaAdapter,
    OrderPrismaAdapter,
    TaxRatePrismaAdapter,
    CollectionPrismaAdapter,
    FacetPrismaAdapter,
];

@Module({
    providers: [PrismaService, PrismaConfigService, ...repositories, ...adapters, OrmAdapterFactory],
    exports: [PrismaService, PrismaConfigService, ...repositories, ...adapters, OrmAdapterFactory],
})
export class PrismaOrmModule {}
