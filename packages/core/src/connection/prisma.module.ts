import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @description
 * PrismaModule provides the PrismaService for database access using Prisma ORM.
 * This module is part of Phase 2 migration from TypeORM to Prisma.
 *
 * The module is marked as @Global() so PrismaService is available throughout
 * the application without needing to import the module in every feature module.
 *
 * @example
 * ```typescript
 * // In your feature module
 * @Module({
 *   providers: [CustomerService],
 * })
 * export class CustomerModule {}
 *
 * // In your service
 * @Injectable()
 * export class CustomerService {
 *   constructor(private prisma: PrismaService) {}
 * }
 * ```
 *
 * @docsCategory modules
 * @since 3.6.0
 */
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}
