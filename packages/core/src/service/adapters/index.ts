/**
 * @description
 * ORM adapters for Phase 2 migration from TypeORM to Prisma.
 *
 * These adapters provide a unified interface for database operations,
 * allowing services to switch between TypeORM and Prisma implementations
 * via feature flags.
 *
 * @docsCategory services
 * @since 3.6.0
 */

export {
    ICustomerOrmAdapter,
    CreateCustomerData,
    UpdateCustomerData,
    CustomerListOptions,
    getCustomerOrmAdapter,
} from './customer-orm.adapter';

export { CustomerPrismaAdapter } from './customer-prisma.adapter';
export { CustomerTypeOrmAdapter } from './customer-typeorm.adapter';
