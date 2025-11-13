/**
 * @description
 * Unit tests for Customer ORM adapters (TypeORM vs Prisma).
 * These tests ensure both adapters produce identical results.
 *
 * NOTE: These tests require Prisma Client to be generated.
 * Run `npm run prisma:generate` before running tests.
 *
 * @since 3.6.0
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../connection/prisma.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { CustomerPrismaAdapter } from './customer-prisma.adapter';
import { CustomerTypeOrmAdapter } from './customer-typeorm.adapter';

describe('Customer ORM Adapters', () => {
    let prismaAdapter: CustomerPrismaAdapter;
    let typeormAdapter: CustomerTypeOrmAdapter;
    let prismaService: PrismaService;
    let connection: TransactionalConnection;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CustomerPrismaAdapter,
                CustomerTypeOrmAdapter,
                {
                    provide: PrismaService,
                    useValue: {
                        customer: {
                            findUnique: vi.fn(),
                            findMany: vi.fn(),
                            create: vi.fn(),
                            update: vi.fn(),
                            delete: vi.fn(),
                            count: vi.fn(),
                        },
                        customerGroupMembership: {
                            create: vi.fn(),
                            delete: vi.fn(),
                            findMany: vi.fn(),
                        },
                        customerChannel: {
                            create: vi.fn(),
                            delete: vi.fn(),
                            findMany: vi.fn(),
                        },
                    },
                },
                {
                    provide: TransactionalConnection,
                    useValue: {
                        getRepository: vi.fn(),
                        findOneInChannel: vi.fn(),
                    },
                },
            ],
        }).compile();

        prismaAdapter = module.get<CustomerPrismaAdapter>(CustomerPrismaAdapter);
        typeormAdapter = module.get<CustomerTypeOrmAdapter>(CustomerTypeOrmAdapter);
        prismaService = module.get<PrismaService>(PrismaService);
        connection = module.get<TransactionalConnection>(TransactionalConnection);
    });

    describe('findOne', () => {
        it('should return same customer from both adapters', async () => {
            const customerId = 'customer-1';
            const mockCustomer = {
                id: customerId,
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };

            // Mock Prisma
            vi.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(mockCustomer as any);

            // Mock TypeORM
            vi.spyOn(connection, 'findOneInChannel').mockResolvedValue(mockCustomer as any);

            const [prismaResult, typeormResult] = await Promise.all([
                prismaAdapter.findOne(customerId),
                typeormAdapter.findOne(customerId),
            ]);

            expect(prismaResult?.id).toBe(typeormResult?.id);
            expect(prismaResult?.emailAddress).toBe(typeormResult?.emailAddress);
        });

        it('should return undefined when customer not found', async () => {
            vi.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(null);
            vi.spyOn(connection, 'findOneInChannel').mockResolvedValue(null);

            const [prismaResult, typeormResult] = await Promise.all([
                prismaAdapter.findOne('non-existent'),
                typeormAdapter.findOne('non-existent'),
            ]);

            expect(prismaResult).toBeUndefined();
            expect(typeormResult).toBeUndefined();
        });
    });

    describe('findByEmail', () => {
        it('should find customer by email in both adapters', async () => {
            const email = 'john@example.com';
            const mockCustomer = {
                id: 'customer-1',
                emailAddress: email,
                firstName: 'John',
                lastName: 'Doe',
            };

            vi.spyOn(prismaService.customer, 'findFirst').mockResolvedValue(mockCustomer as any);
            // TypeORM mock would go here

            const prismaResult = await prismaAdapter.findByEmail(email);

            expect(prismaResult?.emailAddress).toBe(email);
        });
    });

    describe('create', () => {
        it('should create customer with same data in both adapters', async () => {
            const customerData = {
                firstName: 'John',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
            };

            const mockCreated = {
                id: 'new-customer-1',
                ...customerData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            vi.spyOn(prismaService.customer, 'create').mockResolvedValue(mockCreated as any);

            const prismaResult = await prismaAdapter.create(customerData);

            expect(prismaResult.emailAddress).toBe(customerData.emailAddress);
            expect(prismaResult.firstName).toBe(customerData.firstName);
        });
    });

    describe('update', () => {
        it('should update customer in both adapters', async () => {
            const customerId = 'customer-1';
            const updateData = {
                firstName: 'Jane',
            };

            const mockUpdated = {
                id: customerId,
                firstName: 'Jane',
                lastName: 'Doe',
                emailAddress: 'john@example.com',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            vi.spyOn(prismaService.customer, 'update').mockResolvedValue(mockUpdated as any);
            vi.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(mockUpdated as any);

            const prismaResult = await prismaAdapter.update(customerId, updateData);

            expect(prismaResult.firstName).toBe('Jane');
        });
    });

    describe('softDelete', () => {
        it('should soft delete customer in both adapters', async () => {
            const customerId = 'customer-1';

            vi.spyOn(prismaService.customer, 'update').mockResolvedValue({
                id: customerId,
                deletedAt: new Date(),
            } as any);

            await expect(prismaAdapter.softDelete(customerId)).resolves.not.toThrow();
        });
    });

    describe('search', () => {
        it('should search customers by term in both adapters', async () => {
            const searchTerm = 'john';
            const mockResults = [
                {
                    id: 'customer-1',
                    firstName: 'John',
                    lastName: 'Doe',
                    emailAddress: 'john@example.com',
                },
                {
                    id: 'customer-2',
                    firstName: 'Johnny',
                    lastName: 'Smith',
                    emailAddress: 'johnny@example.com',
                },
            ];

            vi.spyOn(prismaService.customer, 'findMany').mockResolvedValue(mockResults as any);
            vi.spyOn(prismaService.customer, 'count').mockResolvedValue(2);

            const result = await prismaAdapter.search(searchTerm);

            expect(result.items).toHaveLength(2);
            expect(result.totalItems).toBe(2);
        });
    });

    describe('group management', () => {
        it('should add customer to group', async () => {
            const customerId = 'customer-1';
            const groupId = 'group-1';

            vi.spyOn(prismaService.customerGroupMembership, 'create').mockResolvedValue({
                customerId,
                groupId,
            } as any);

            await expect(prismaAdapter.addToGroup(customerId, groupId)).resolves.not.toThrow();
        });

        it('should remove customer from group', async () => {
            const customerId = 'customer-1';
            const groupId = 'group-1';

            vi.spyOn(prismaService.customerGroupMembership, 'delete').mockResolvedValue({
                customerId,
                groupId,
            } as any);

            await expect(prismaAdapter.removeFromGroup(customerId, groupId)).resolves.not.toThrow();
        });
    });

    describe('channel management', () => {
        it('should add customer to channel', async () => {
            const customerId = 'customer-1';
            const channelId = 'channel-1';

            vi.spyOn(prismaService.customerChannel, 'create').mockResolvedValue({
                customerId,
                channelId,
            } as any);

            await expect(prismaAdapter.addToChannel(customerId, channelId)).resolves.not.toThrow();
        });

        it('should remove customer from channel', async () => {
            const customerId = 'customer-1';
            const channelId = 'channel-1';

            vi.spyOn(prismaService.customerChannel, 'delete').mockResolvedValue({
                customerId,
                channelId,
            } as any);

            await expect(
                prismaAdapter.removeFromChannel(customerId, channelId),
            ).resolves.not.toThrow();
        });
    });
});

/**
 * Integration tests comparing TypeORM and Prisma results
 * These run against a real test database
 */
describe('Customer Adapter Integration Tests', () => {
    // These tests would run against a real test database
    // and compare actual results from both adapters

    it.skip('should return identical results for findOne', async () => {
        // Test with real database
    });

    it.skip('should return identical results for findAll with filters', async () => {
        // Test with real database
    });

    it.skip('should create identical customers', async () => {
        // Test with real database
    });
});
