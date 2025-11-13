# Phase 2 Migration Guide: TypeORM → Prisma

This guide provides step-by-step instructions for migrating Vendure from TypeORM to Prisma ORM.

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL 12+ (or MySQL 8+, SQLite 3+)
- Existing Vendure installation with TypeORM
- Basic understanding of Prisma and TypeORM

## 🚀 Getting Started

### Step 1: Install Dependencies

Dependencies are already added to `packages/core/package.json`. Install them:

```bash
# From the root of the monorepo
npm install

# Or specifically in @vendure/core
cd packages/core
npm install
```

### Step 2: Configure Environment

Create or update your `.env` file:

```bash
# Database connection for Prisma
DATABASE_URL="postgresql://user:password@localhost:5432/vendure"

# Enable Prisma (feature flag)
VENDURE_ENABLE_PRISMA=false  # Set to true when ready to use Prisma

# Enable Prisma query logging (development only)
PRISMA_LOG_QUERIES=false  # Set to true to see all queries
```

### Step 3: Validate Prisma Schema

```bash
cd packages/core
npm run prisma:validate
```

This will check the Prisma schema for errors.

### Step 4: Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the type-safe Prisma Client in `node_modules/.prisma/client`.

## 🗄️ Database Migration Strategies

### Strategy A: Introspect Existing Database (RECOMMENDED)

Use this approach to generate Prisma schema from your existing TypeORM database:

```bash
# 1. Pull schema from database
npm run prisma:db:pull

# 2. Review generated schema in prisma/schema.prisma
# 3. Refine schema (add @@map, @map, customize field types)
# 4. Generate client
npm run prisma:generate

# 5. Create initial migration from refined schema
npm run prisma:migrate:dev --name init_from_typeorm
```

**Pros:**
- Guaranteed compatibility with existing database
- No data migration needed
- Quick start

**Cons:**
- Generated schema might need manual refinement
- Naming conventions might not match Prisma best practices

### Strategy B: Schema-First (Clean Slate)

Use this for new projects or if you want to redesign the schema:

```bash
# 1. Design schema in prisma/schema.prisma (already done)
# 2. Create migration
npm run prisma:migrate:dev --name init

# 3. This will:
#    - Create SQL migration files
#    - Apply migration to database
#    - Generate Prisma Client
```

**Pros:**
- Clean, well-designed schema
- Prisma best practices from the start

**Cons:**
- Requires data migration from TypeORM tables
- More complex initial setup

### Strategy C: Parallel Run (Zero Downtime)

Run TypeORM and Prisma side-by-side:

```bash
# 1. Use Strategy A to pull existing schema
npm run prisma:db:pull

# 2. Both ORMs connect to the same database
# 3. Use feature flag to switch between implementations
# 4. Gradually migrate services from TypeORM to Prisma
# 5. Remove TypeORM once all services migrated
```

**This is the recommended production approach.**

## 📝 Phase-by-Phase Migration

### Phase 2.1: Setup ✅

Already complete! You now have:
- [x] Prisma schema designed
- [x] PrismaService created
- [x] PrismaModule created
- [x] Dependencies installed
- [x] Scripts added to package.json

### Phase 2.2: Initial Setup (Current)

1. **Generate Prisma Client:**
   ```bash
   cd packages/core
   npm run prisma:generate
   ```

2. **Choose Migration Strategy:**
   - For existing project: Use Strategy A (Introspect)
   - For new/testing: Use Strategy B or C

3. **Create First Migration:**
   ```bash
   # If using Strategy A (after introspection)
   npm run prisma:migrate:dev --name init_from_typeorm

   # If using Strategy B (from designed schema)
   npm run prisma:migrate:dev --name init
   ```

4. **Test Connection:**
   ```typescript
   // In a test file or REPL
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
   await prisma.$connect();
   console.log('Connected!');
   ```

### Phase 2.3: Pilot Migration (Customer + Address)

1. **Enable PrismaModule in AppModule:**

   ```typescript
   // packages/core/src/app.module.ts
   import { PrismaModule } from './connection/prisma.module';

   @Module({
     imports: [
       // ... existing imports
       PrismaModule, // Add this
     ],
   })
   export class AppModule {}
   ```

2. **Create Customer Repository (Prisma):**

   ```typescript
   // packages/core/src/service/services/customer-prisma.repository.ts
   import { Injectable } from '@nestjs/common';
   import { PrismaService } from '../../connection/prisma.service';
   import { Customer, Prisma } from '@prisma/client';

   @Injectable()
   export class CustomerPrismaRepository {
     constructor(private prisma: PrismaService) {}

     async findOne(id: string) {
       return this.prisma.customer.findUnique({
         where: { id },
         include: {
           addresses: true,
           user: true,
         },
       });
     }

     async create(data: Prisma.CustomerCreateInput) {
       return this.prisma.customer.create({ data });
     }

     // ... more methods
   }
   ```

3. **Update CustomerService to use Feature Flag:**

   ```typescript
   // packages/core/src/service/services/customer.service.ts
   import { CustomerPrismaRepository } from './customer-prisma.repository';

   @Injectable()
   export class CustomerService {
     private usePrisma = process.env.VENDURE_ENABLE_PRISMA === 'true';

     constructor(
       private typeormRepo: CustomerRepository, // Existing
       private prismaRepo: CustomerPrismaRepository, // New
     ) {}

     async findOne(ctx: RequestContext, id: ID) {
       if (this.usePrisma) {
         return this.prismaRepo.findOne(id);
       }
       return this.typeormRepo.findOne(id);
     }
   }
   ```

4. **Test Both Implementations:**

   ```typescript
   describe('Customer Service Migration', () => {
     it('should return same results from TypeORM and Prisma', async () => {
       const customerId = 'test-id';

       // Query with TypeORM
       process.env.VENDURE_ENABLE_PRISMA = 'false';
       const typeormResult = await customerService.findOne(ctx, customerId);

       // Query with Prisma
       process.env.VENDURE_ENABLE_PRISMA = 'true';
       const prismaResult = await customerService.findOne(ctx, customerId);

       // Compare results (normalize to account for slight differences)
       expect(normalize(prismaResult)).toEqual(normalize(typeormResult));
     });
   });
   ```

5. **Performance Benchmark:**

   ```typescript
   // benchmark.ts
   import { performance } from 'perf_hooks';

   async function benchmark() {
     const iterations = 1000;

     // Benchmark TypeORM
     const typeormStart = performance.now();
     for (let i = 0; i < iterations; i++) {
       await customerService.findOne(ctx, 'test-id');
     }
     const typeormTime = performance.now() - typeormStart;

     // Benchmark Prisma
     const prismaStart = performance.now();
     for (let i = 0; i < iterations; i++) {
       await customerPrismaRepository.findOne('test-id');
     }
     const prismaTime = performance.now() - prismaStart;

     console.log(`TypeORM: ${typeormTime}ms`);
     console.log(`Prisma: ${prismaTime}ms`);
     console.log(`Improvement: ${((1 - prismaTime / typeormTime) * 100).toFixed(2)}%`);
   }
   ```

### Phase 2.4-2.7: Subsequent Phases

Follow the same pattern as Phase 2.3 for each entity group:
1. Update/add Prisma schema
2. Generate Prisma Client
3. Create Prisma repository
4. Update service with feature flag
5. Test and benchmark
6. Enable for production

## 🧪 Testing

### Unit Tests

```typescript
import { createMock } from '@golevelup/ts-jest';
import { PrismaClient } from '@prisma/client';

describe('CustomerPrismaRepository', () => {
  let repository: CustomerPrismaRepository;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prismaService = createMock<PrismaService>();
    repository = new CustomerPrismaRepository(prismaService);
  });

  it('should find customer by id', async () => {
    const mockCustomer = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
    };

    prismaService.customer.findUnique.mockResolvedValue(mockCustomer as any);

    const result = await repository.findOne('1');

    expect(result).toEqual(mockCustomer);
    expect(prismaService.customer.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { addresses: true, user: true },
    });
  });
});
```

### Integration Tests

```bash
# Set up test database
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/vendure_test"

# Run tests
npm run test
```

### E2E Tests

```bash
# E2E tests should work with either ORM via feature flag
VENDURE_ENABLE_PRISMA=false npm run e2e  # Test with TypeORM
VENDURE_ENABLE_PRISMA=true npm run e2e   # Test with Prisma
```

## 🔧 Common Tasks

### View Database in Prisma Studio

```bash
npm run prisma:studio
```

Opens a web UI at http://localhost:5555 to browse and edit data.

### Create a New Migration

```bash
# After modifying schema.prisma
npm run prisma:migrate:dev --name add_new_field
```

### Reset Database (DEV ONLY)

```bash
# WARNING: Deletes all data!
npm run prisma:migrate:reset
```

### Apply Migrations (Production)

```bash
npm run prisma:migrate:deploy
```

### Generate Prisma Client (After Schema Changes)

```bash
npm run prisma:generate
```

## 🐛 Troubleshooting

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npm install
npm run prisma:generate
```

### Issue: "Database schema out of sync"

**Solution:**
```bash
# Development
npm run prisma:db:push

# Production (create proper migration)
npm run prisma:migrate:dev --name fix_schema
```

### Issue: "Migration failed"

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# Mark migration as applied (if manually fixed)
npx prisma migrate resolve --applied "MIGRATION_NAME"

# Or rollback (dev only)
npm run prisma:migrate:reset
```

### Issue: Performance Degradation

**Check:**
1. Are you using `include` efficiently? (Only include what you need)
2. Do you have proper indexes? (Check with `EXPLAIN ANALYZE`)
3. Is query logging enabled? (Disable in production: `PRISMA_LOG_QUERIES=false`)

**Debug slow queries:**
```typescript
const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }],
});

prisma.$on('query', (e) => {
  if (e.duration > 100) {
    console.warn(`Slow query (${e.duration}ms):`, e.query);
  }
});
```

### Issue: Type Errors with Prisma Client

**Solution:**
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Restart TypeScript server in your IDE
```

## 📊 Monitoring & Observability

### Query Logging

```typescript
// Enable in development
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Metrics

```typescript
// Get Prisma metrics
const metrics = await prisma.$metrics.json();
console.log(metrics);
```

### Health Check

```typescript
// Add to health check endpoint
@Get('/health')
async healthCheck() {
  const isHealthy = await this.prisma.healthCheck();
  return { prisma: isHealthy };
}
```

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] All migrations tested in staging
- [ ] Performance benchmarks meet targets
- [ ] E2E tests pass with Prisma enabled
- [ ] Rollback plan documented
- [ ] Feature flag strategy defined
- [ ] Monitoring and alerting set up

### Deployment Steps

1. **Deploy with Feature Flag OFF:**
   ```bash
   VENDURE_ENABLE_PRISMA=false
   ```

2. **Apply Migrations:**
   ```bash
   npm run prisma:migrate:deploy
   ```

3. **Enable for Read Operations:**
   ```bash
   VENDURE_ENABLE_PRISMA_READS=true
   VENDURE_ENABLE_PRISMA_WRITES=false
   ```

4. **Monitor Performance:**
   - Watch for errors
   - Compare response times
   - Check database load

5. **Enable for Write Operations:**
   ```bash
   VENDURE_ENABLE_PRISMA_READS=true
   VENDURE_ENABLE_PRISMA_WRITES=true
   ```

6. **Full Cutover:**
   ```bash
   VENDURE_ENABLE_PRISMA=true
   ```

7. **Remove TypeORM Code:**
   - After stable operation (1-2 weeks)
   - Remove TypeORM dependencies
   - Remove TypeORM repositories
   - Update documentation

### Rollback Plan

If issues occur:

1. **Immediate Rollback:**
   ```bash
   VENDURE_ENABLE_PRISMA=false
   ```

2. **Investigate Issues:**
   - Check Prisma logs
   - Compare query outputs
   - Review performance metrics

3. **Fix and Retry:**
   - Address issues in staging
   - Re-test thoroughly
   - Deploy again

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Migrating from TypeORM](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-typeorm)
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)
- [PHASE2_PRISMA_MIGRATION.md](./PHASE2_PRISMA_MIGRATION.md) - Detailed migration plan

## 🤝 Getting Help

- **GitHub Issues**: Report bugs or request features
- **Discord**: Join Vendure community for real-time help
- **Documentation**: Check Vendure and Prisma docs

## ✅ Success Criteria

Migration is complete when:
- [x] Prisma schema covers all 74 entities
- [x] All services use Prisma (TypeORM removed)
- [x] All tests pass with Prisma
- [x] Performance meets or exceeds TypeORM baseline
- [x] Production deployment successful
- [x] Zero data integrity issues
- [x] Team is trained on Prisma

---

**Current Status: Phase 2.2 - Initial Setup** ✅

**Next Steps:**
1. Run `npm run prisma:generate`
2. Choose migration strategy
3. Create first migration
4. Start Phase 2.3 (Customer + Address pilot)
