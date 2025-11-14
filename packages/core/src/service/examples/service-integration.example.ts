/**
 * @description
 * Example of how to integrate ORM adapters into existing services.
 * This file demonstrates the migration pattern for converting services
 * from direct TypeORM usage to the ORM adapter pattern.
 *
 * @since 3.6.0
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/require-await */

import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { OrmAdapterFactory } from '../adapters/orm-adapter.factory';
import { PrismaConfigService } from '../config/prisma-config.service';
import { Customer } from '../entity/customer/customer.entity';

/**
 * BEFORE: Traditional service using TypeORM directly
 */
@Injectable()
export class CustomerServiceBefore {
    // Direct TypeORM repository injection
    // constructor(@InjectRepository(Customer) private customerRepository: Repository<Customer>) {}

    async findOne(id: ID): Promise<Customer | undefined> {
        // Direct TypeORM call
        // return this.customerRepository.findOne({ where: { id } });
        return undefined;
    }

    async create(data: any): Promise<Customer> {
        // Direct TypeORM call
        // const customer = this.customerRepository.create(data);
        // return this.customerRepository.save(customer);
        return {} as Customer;
    }
}

/**
 * AFTER: Modern service using ORM adapter pattern
 */
@Injectable()
export class CustomerServiceAfter {
    constructor(
        private readonly ormFactory: OrmAdapterFactory,
        private readonly prismaConfig: PrismaConfigService,
    ) {}

    async findOne(id: ID): Promise<Customer | undefined> {
        // Use adapter factory to get the appropriate adapter
        const customerAdapter = this.ormFactory.getCustomerAdapter();

        // Call adapter method (works with both TypeORM and Prisma)
        return customerAdapter.findOne(id, true);
    }

    async create(data: any): Promise<Customer> {
        const customerAdapter = this.ormFactory.getCustomerAdapter();
        return customerAdapter.create(data);
    }

    /**
     * Example: Check which ORM is being used
     */
    getOrmInfo(): string {
        if (this.prismaConfig.isUsingPrisma()) {
            return 'Using Prisma ORM';
        } else {
            return 'Using TypeORM';
        }
    }
}

/**
 * PATTERN: Service with optional performance logging
 */
@Injectable()
export class ProductServiceWithLogging {
    constructor(
        private readonly ormFactory: OrmAdapterFactory,
        private readonly prismaConfig: PrismaConfigService,
    ) {}

    async findOne(id: ID): Promise<any | undefined> {
        const startTime = Date.now();

        const productAdapter = this.ormFactory.getProductAdapter();
        const result = await productAdapter.findOne(id, true);

        if (this.prismaConfig.shouldCollectPerformanceMetrics()) {
            const duration = Date.now() - startTime;
            console.log(`[${this.prismaConfig.getOrmMode()}] Product.findOne took ${duration}ms`);
        }

        return result;
    }

    async findAll(options: any): Promise<any> {
        const productAdapter = this.ormFactory.getProductAdapter();

        if (this.prismaConfig.shouldLogQueries()) {
            console.log(`[${this.prismaConfig.getOrmMode()}] Executing Product.findAll`, options);
        }

        return productAdapter.findAll(options);
    }
}

/**
 * PATTERN: Service with fallback handling
 */
@Injectable()
export class OrderServiceWithFallback {
    constructor(private readonly ormFactory: OrmAdapterFactory) {}

    async findOne(id: ID): Promise<any | undefined> {
        try {
            const orderAdapter = this.ormFactory.getOrderAdapter();
            return await orderAdapter.findOne(id, true);
        } catch (error) {
            // Log error and potentially fall back to TypeORM
            console.error('Error fetching order:', error);
            throw error;
        }
    }
}

/**
 * MIGRATION GUIDE:
 *
 * Step 1: Add OrmAdapterFactory to constructor
 * -----------------------------------------------
 * Before:
 *   constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}
 *
 * After:
 *   constructor(private readonly ormFactory: OrmAdapterFactory) {}
 *
 *
 * Step 2: Replace direct repository calls with adapter calls
 * -----------------------------------------------------------
 * Before:
 *   const customer = await this.repo.findOne({ where: { id } });
 *
 * After:
 *   const adapter = this.ormFactory.getCustomerAdapter();
 *   const customer = await adapter.findOne(id);
 *
 *
 * Step 3: Update method signatures to use adapter interfaces
 * -----------------------------------------------------------
 * Before:
 *   async findAll(options: FindManyOptions<Customer>) {...}
 *
 * After:
 *   async findAll(options: CustomerListOptions) {...}
 *
 *
 * Step 4: Add optional performance monitoring
 * --------------------------------------------
 * constructor(
 *   private readonly ormFactory: OrmAdapterFactory,
 *   private readonly prismaConfig: PrismaConfigService,
 * ) {}
 *
 * if (this.prismaConfig.shouldCollectPerformanceMetrics()) {
 *   // Log performance metrics
 * }
 *
 *
 * ENVIRONMENT VARIABLES:
 * ----------------------
 * VENDURE_ENABLE_PRISMA=true              # Enable Prisma support
 * VENDURE_ORM_MODE=prisma                 # Set to 'prisma' or 'typeorm'
 * VENDURE_PRISMA_LOG_QUERIES=true         # Log all queries
 * VENDURE_PRISMA_PERFORMANCE_METRICS=true # Collect performance metrics
 */
