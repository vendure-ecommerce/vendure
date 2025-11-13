/**
 * @description
 * This file demonstrates how to integrate the ORM adapter pattern into CustomerService.
 * This is an EXAMPLE only - it shows the pattern but is not the actual implementation.
 *
 * The actual CustomerService integration will be done in a later commit to avoid
 * breaking existing functionality during the migration period.
 *
 * @example How to use in CustomerService
 * ```typescript
 * import { CustomerPrismaAdapter, CustomerTypeOrmAdapter, ICustomerOrmAdapter } from '../adapters';
 *
 * @Injectable()
 * export class CustomerService {
 *     private ormAdapter: ICustomerOrmAdapter;
 *
 *     constructor(
 *         // Existing dependencies
 *         private connection: TransactionalConnection,
 *         private configService: ConfigService,
 *         // ... other dependencies
 *
 *         // NEW: ORM adapters
 *         private typeormAdapter: CustomerTypeOrmAdapter,
 *         private prismaAdapter: CustomerPrismaAdapter,
 *     ) {
 *         // Select adapter based on feature flag
 *         const usePrisma = this.shouldUsePrisma();
 *         this.ormAdapter = usePrisma ? this.prismaAdapter : this.typeormAdapter;
 *     }
 *
 *     // Example: Refactored findOne method using adapter
 *     async findOne(ctx: RequestContext, id: ID): Promise<Customer | undefined> {
 *         return this.ormAdapter.findOne(id, ['addresses', 'user']);
 *     }
 *
 *     // Example: Refactored findAll method using adapter
 *     async findAll(
 *         ctx: RequestContext,
 *         options?: ListQueryOptions<Customer>
 *     ): Promise<PaginatedList<Customer>> {
 *         return this.ormAdapter.findAll({
 *             skip: options?.skip,
 *             take: options?.take,
 *             filter: options?.filter,
 *             sort: options?.sort,
 *         });
 *     }
 *
 *     // Example: Refactored create method using adapter
 *     async create(
 *         ctx: RequestContext,
 *         input: CreateCustomerInput,
 *         password?: string
 *     ): Promise<Customer> {
 *         // Create user if password provided
 *         let user: User | undefined;
 *         if (password) {
 *             user = await this.userService.createCustomerUser(
 *                 ctx,
 *                 input.emailAddress,
 *                 password
 *             );
 *         }
 *
 *         // Use adapter to create customer
 *         const customer = await this.ormAdapter.create({
 *             firstName: input.firstName,
 *             lastName: input.lastName,
 *             emailAddress: input.emailAddress,
 *             title: input.title,
 *             phoneNumber: input.phoneNumber,
 *             userId: user?.id,
 *             customFields: input.customFields,
 *         });
 *
 *         // Add to channel
 *         await this.ormAdapter.addToChannel(customer.id, ctx.channelId);
 *
 *         // Emit event
 *         this.eventBus.publish(new CustomerEvent(ctx, customer, 'created'));
 *
 *         return customer;
 *     }
 *
 *     // Helper: Determine which ORM to use
 *     private shouldUsePrisma(): boolean {
 *         // Check environment variable
 *         if (process.env.VENDURE_ENABLE_PRISMA === 'true') {
 *             return true;
 *         }
 *
 *         // Or check config service
 *         const prismaConfig = this.configService.vendureConfig.prisma;
 *         if (prismaConfig?.enabled) {
 *             return true;
 *         }
 *
 *         // Default to TypeORM (safe)
 *         return false;
 *     }
 * }
 * ```
 *
 * @since 3.6.0
 */

/* eslint-disable no-console */

import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Customer } from '../../entity/customer/customer.entity';
import { CustomerPrismaAdapter, CustomerTypeOrmAdapter, ICustomerOrmAdapter } from '../adapters';

/**
 * Example service showing adapter integration pattern
 * NOT FOR PRODUCTION USE - This is a demonstration only
 */
@Injectable()
export class ExampleCustomerService {
    private ormAdapter: ICustomerOrmAdapter;

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private typeormAdapter: CustomerTypeOrmAdapter,
        private prismaAdapter: CustomerPrismaAdapter,
    ) {
        // Select adapter based on configuration
        const usePrisma = this.shouldUsePrisma();
        this.ormAdapter = usePrisma ? this.prismaAdapter : this.typeormAdapter;

        if (usePrisma) {
            console.log('🚀 Using Prisma ORM for Customer operations');
        } else {
            console.log('📦 Using TypeORM for Customer operations (legacy)');
        }
    }

    /**
     * Example: Find one customer
     */
    async findOne(ctx: RequestContext, id: ID): Promise<Customer | undefined> {
        return this.ormAdapter.findOne(id, ['addresses', 'user']);
    }

    /**
     * Example: Find all customers with pagination
     */
    async findAll(ctx: RequestContext, options: any): Promise<PaginatedList<Customer>> {
        return this.ormAdapter.findAll({
            skip: options?.skip || 0,
            take: options?.take || 20,
            filter: options?.filter || {},
            sort: options?.sort || {},
        });
    }

    /**
     * Example: Create a customer
     */
    async create(ctx: RequestContext, data: any): Promise<Customer> {
        const customer = await this.ormAdapter.create({
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            title: data.title,
            phoneNumber: data.phoneNumber,
            userId: data.userId,
            customFields: data.customFields,
        });

        // Add to current channel
        await this.ormAdapter.addToChannel(customer.id, ctx.channelId);

        return customer;
    }

    /**
     * Example: Update a customer
     */
    async update(ctx: RequestContext, id: ID, data: any): Promise<Customer> {
        return this.ormAdapter.update(id, {
            firstName: data.firstName,
            lastName: data.lastName,
            emailAddress: data.emailAddress,
            title: data.title,
            phoneNumber: data.phoneNumber,
            customFields: data.customFields,
        });
    }

    /**
     * Example: Delete a customer (soft delete)
     */
    async delete(ctx: RequestContext, id: ID): Promise<void> {
        await this.ormAdapter.softDelete(id);
    }

    /**
     * Example: Search customers
     */
    async search(ctx: RequestContext, searchTerm: string, options: any): Promise<PaginatedList<Customer>> {
        return this.ormAdapter.search(searchTerm, {
            skip: options?.skip || 0,
            take: options?.take || 20,
        });
    }

    /**
     * Determine which ORM implementation to use
     */
    private shouldUsePrisma(): boolean {
        // Strategy 1: Environment variable (highest priority)
        if (process.env.VENDURE_ENABLE_PRISMA === 'true') {
            return true;
        }
        if (process.env.VENDURE_ENABLE_PRISMA === 'false') {
            return false;
        }

        // Strategy 2: Config service
        const vendureConfig = this.configService.vendureConfig as any;
        if (vendureConfig.prisma?.enabled === true) {
            return true;
        }

        // Strategy 3: Per-operation flags (for gradual rollout)
        // if (process.env.VENDURE_ENABLE_PRISMA_READS === 'true') {
        //     return true; // Use Prisma for reads only
        // }

        // Default: Use TypeORM (safe fallback)
        return false;
    }

    /**
     * Example: Runtime ORM switching (advanced)
     * Allows A/B testing by comparing results from both ORMs
     */
    async findOneWithComparison(ctx: RequestContext, id: ID): Promise<Customer | undefined> {
        if (process.env.VENDURE_COMPARE_ORMS === 'true') {
            // Fetch from both ORMs
            const [typeormResult, prismaResult] = await Promise.all([
                this.typeormAdapter.findOne(id, ['addresses', 'user']),
                this.prismaAdapter.findOne(id, ['addresses', 'user']),
            ]);

            // Compare results (simplified)
            if (typeormResult && prismaResult) {
                const match =
                    typeormResult.id === prismaResult.id &&
                    typeormResult.emailAddress === prismaResult.emailAddress;

                if (!match) {
                    console.warn('⚠️ ORM results differ for customer', id);
                }
            }

            // Return based on current adapter setting
            return this.ormAdapter === this.prismaAdapter ? prismaResult : typeormResult;
        }

        // Normal mode: use selected adapter
        return this.ormAdapter.findOne(id, ['addresses', 'user']);
    }
}
