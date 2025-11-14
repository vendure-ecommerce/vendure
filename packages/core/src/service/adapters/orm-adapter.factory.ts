/**
 * @description
 * Factory for creating ORM adapters based on runtime configuration.
 * Allows switching between TypeORM and Prisma implementations.
 *
 * @since 3.6.0
 */

import { Injectable, Logger, NotImplementedException } from '@nestjs/common';

import { PrismaConfigService } from '../config/prisma-config.service';

import { ICollectionOrmAdapter } from './collection-orm.adapter';
import { CollectionPrismaAdapter } from './collection-prisma.adapter';
import { ICustomerOrmAdapter } from './customer-orm.adapter';
import { CustomerPrismaAdapter } from './customer-prisma.adapter';
import { IFacetOrmAdapter } from './facet-orm.adapter';
import { FacetPrismaAdapter } from './facet-prisma.adapter';
import { IOrderOrmAdapter } from './order-orm.adapter';
import { OrderPrismaAdapter } from './order-prisma.adapter';
import { IProductOrmAdapter } from './product-orm.adapter';
import { ProductPrismaAdapter } from './product-prisma.adapter';
import { ITaxRateOrmAdapter } from './tax-rate-orm.adapter';
import { TaxRatePrismaAdapter } from './tax-rate-prisma.adapter';

/**
 * Factory for creating ORM adapters
 */
@Injectable()
export class OrmAdapterFactory {
    private readonly logger = new Logger(OrmAdapterFactory.name);

    constructor(
        private readonly prismaConfig: PrismaConfigService,
        // Prisma adapters
        private readonly customerPrismaAdapter: CustomerPrismaAdapter,
        private readonly productPrismaAdapter: ProductPrismaAdapter,
        private readonly orderPrismaAdapter: OrderPrismaAdapter,
        private readonly taxRatePrismaAdapter: TaxRatePrismaAdapter,
        private readonly collectionPrismaAdapter: CollectionPrismaAdapter,
        private readonly facetPrismaAdapter: FacetPrismaAdapter,
    ) {}

    /**
     * Get Customer ORM adapter
     */
    getCustomerAdapter(): ICustomerOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.customerPrismaAdapter;
        }

        return this.throwTypeOrmNotImplemented('Customer');
    }

    /**
     * Get Product ORM adapter
     */
    getProductAdapter(): IProductOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.productPrismaAdapter;
        }

        return this.throwTypeOrmNotImplemented('Product');
    }

    /**
     * Get Order ORM adapter
     */
    getOrderAdapter(): IOrderOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.orderPrismaAdapter;
        }

        return this.throwTypeOrmNotImplemented('Order');
    }

    /**
     * Get TaxRate ORM adapter
     */
    getTaxRateAdapter(): ITaxRateOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.taxRatePrismaAdapter;
        }

        return this.throwTypeOrmNotImplemented('TaxRate');
    }

    /**
     * Get Collection ORM adapter
     */
    getCollectionAdapter(): ICollectionOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.collectionPrismaAdapter;
        }

        return this.throwTypeOrmNotImplemented('Collection');
    }

    /**
     * Get Facet ORM adapter
     */
    getFacetAdapter(): IFacetOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.facetPrismaAdapter;
        }

        return this.throwTypeOrmNotImplemented('Facet');
    }

    /**
     * Throw descriptive error when TypeORM adapter is not yet implemented
     */
    private throwTypeOrmNotImplemented(entityName: string): never {
        const errorMessage = [
            `TypeORM ${entityName} adapter is not yet implemented.`,
            '',
            'The Prisma ORM adapters are currently the only available implementation.',
            'To use Prisma, please configure your Vendure server:',
            '',
            '1. Set environment variable: VENDURE_ENABLE_PRISMA=true',
            '2. Or configure in VendureConfig:',
            '   {',
            '     dbConnectionOptions: {',
            '       enablePrisma: true,',
            '       ormMode: "prisma"',
            '     }',
            '   }',
            '',
            `For more information, see the Prisma migration guide in packages/core/PRISMA_MIGRATION.md`,
        ].join('\n');

        this.logger.error(errorMessage);
        throw new NotImplementedException(errorMessage);
    }
}
