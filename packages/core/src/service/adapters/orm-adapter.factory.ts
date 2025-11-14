/**
 * @description
 * Factory for creating ORM adapters based on runtime configuration.
 * Allows switching between TypeORM and Prisma implementations.
 *
 * @since 3.6.0
 */

import { Injectable } from '@nestjs/common';

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

        // TODO: Return TypeORM adapter when implemented
        throw new Error('TypeORM Customer adapter not yet implemented');
    }

    /**
     * Get Product ORM adapter
     */
    getProductAdapter(): IProductOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.productPrismaAdapter;
        }

        // TODO: Return TypeORM adapter when implemented
        throw new Error('TypeORM Product adapter not yet implemented');
    }

    /**
     * Get Order ORM adapter
     */
    getOrderAdapter(): IOrderOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.orderPrismaAdapter;
        }

        // TODO: Return TypeORM adapter when implemented
        throw new Error('TypeORM Order adapter not yet implemented');
    }

    /**
     * Get TaxRate ORM adapter
     */
    getTaxRateAdapter(): ITaxRateOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.taxRatePrismaAdapter;
        }

        // TODO: Return TypeORM adapter when implemented
        throw new Error('TypeORM TaxRate adapter not yet implemented');
    }

    /**
     * Get Collection ORM adapter
     */
    getCollectionAdapter(): ICollectionOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.collectionPrismaAdapter;
        }

        // TODO: Return TypeORM adapter when implemented
        throw new Error('TypeORM Collection adapter not yet implemented');
    }

    /**
     * Get Facet ORM adapter
     */
    getFacetAdapter(): IFacetOrmAdapter {
        if (this.prismaConfig.isUsingPrisma()) {
            return this.facetPrismaAdapter;
        }

        // TODO: Return TypeORM adapter when implemented
        throw new Error('TypeORM Facet adapter not yet implemented');
    }
}
