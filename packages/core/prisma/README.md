# Vendure Prisma Integration

This directory contains the Prisma schema and migration files for Vendure's transition from TypeORM to Prisma ORM.

## 📁 Directory Structure

```
prisma/
├── schema.prisma           # Main Prisma schema
├── migrations/            # Database migration history
│   └── YYYYMMDD_name/    # Individual migrations
├── seed.ts               # Database seeding script
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- PostgreSQL (or MySQL/SQLite)
- DATABASE_URL environment variable set

### Installation

Prisma dependencies are already included in `@vendure/core`. No additional installation needed.

### Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create a new migration
npm run prisma:migrate:dev --name <migration-name>

# Apply migrations (production)
npm run prisma:migrate:deploy

# Reset database (DEV ONLY - destroys all data!)
npm run prisma:migrate:reset

# Pull existing database schema
npm run prisma:db:pull

# Push schema changes without migration (dev only)
npm run prisma:db:push

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Format schema file
npm run prisma:format

# Validate schema
npm run prisma:validate
```

## 📊 Schema Overview

### Current Status: Phase 2.3 - Pilot Migration

The schema currently includes:

#### ✅ Fully Migrated
- **Customer** - Customer entity with all relations
- **Address** - Customer addresses
- **CustomerGroup** - Customer grouping

#### 🔄 Partial (Relations Only)
- **User** - For customer authentication
- **Channel** - Multi-channel support
- **Country/Region** - For address countries
- **Order** - Minimal definition for customer relations
- **Product** - Minimal definition for channel relations

#### ⏳ Pending
- Product catalog (Phase 2.4)
- Order management (Phase 2.4)
- 60+ other entities (Phase 2.5)

## 🔧 Configuration

### Database Connection

Set your database URL in `.env`:

```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/vendure"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/vendure"

# SQLite (dev only)
DATABASE_URL="file:./dev.db"
```

### Prisma Client Location

The Prisma Client is generated to:
```
node_modules/.prisma/client
```

Import it in your code:
```typescript
import { PrismaClient } from '@prisma/client';
```

Or use the PrismaService:
```typescript
import { PrismaService } from '../connection/prisma.service';
```

## 📝 Schema Conventions

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Model names | PascalCase | `Customer`, `OrderLine` |
| Field names | camelCase | `firstName`, `emailAddress` |
| Table names | snake_case | `customer`, `order_line` |
| Relation names | PascalCase | `CustomerOrders` |

### Field Patterns

All models should follow this base pattern:

```prisma
model EntityName {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Entity-specific fields...

  // Soft delete (if applicable)
  deletedAt DateTime?

  // Custom fields (if applicable)
  customFields Json?

  @@map("entity_name")
}
```

### Relationship Patterns

#### One-to-Many
```prisma
model Customer {
  id        String    @id
  addresses Address[]
}

model Address {
  id         String   @id
  customer   Customer @relation(fields: [customerId], references: [id])
  customerId String

  @@index([customerId])
}
```

#### Many-to-Many (Explicit Join Table)
```prisma
model Customer {
  id     String                      @id
  groups CustomerGroupMembership[]
}

model CustomerGroup {
  id        String                      @id
  customers CustomerGroupMembership[]
}

model CustomerGroupMembership {
  customer   Customer      @relation(fields: [customerId], references: [id])
  customerId String

  group      CustomerGroup @relation(fields: [groupId], references: [id])
  groupId    String

  @@id([customerId, groupId])
}
```

### Index Strategy

- Add `@@index([field])` for foreign keys
- Add `@@index([field])` for frequently queried fields
- Add `@@unique([field])` for unique constraints
- Use composite indexes for multi-field queries

## 🧪 Testing with Prisma

### Unit Testing

```typescript
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

describe('CustomerService', () => {
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prisma = mockDeep<PrismaClient>();
  });

  afterEach(() => {
    mockReset(prisma);
  });

  it('should find customer by id', async () => {
    const mockCustomer = { id: '1', firstName: 'John', lastName: 'Doe' };
    prisma.customer.findUnique.mockResolvedValue(mockCustomer);

    const result = await service.findOne('1');
    expect(result).toEqual(mockCustomer);
  });
});
```

### Integration Testing

```typescript
import { PrismaClient } from '@prisma/client';

describe('Customer Integration Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient({
      datasources: { db: { url: process.env.TEST_DATABASE_URL } }
    });
  });

  beforeEach(async () => {
    // Clean database
    await prisma.customer.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create and retrieve customer', async () => {
    const customer = await prisma.customer.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        emailAddress: 'john@example.com',
      },
    });

    const found = await prisma.customer.findUnique({
      where: { id: customer.id },
    });

    expect(found?.emailAddress).toBe('john@example.com');
  });
});
```

## 🔄 Migration from TypeORM

### Migration Process

1. **Schema Design** ✅
   - Prisma schema created
   - Conventions documented

2. **Setup Prisma** (Current)
   - Install dependencies
   - Configure PrismaService
   - Generate client

3. **Parallel Implementation**
   - Keep TypeORM running
   - Add Prisma queries alongside
   - Feature flag to switch

4. **Testing & Validation**
   - Compare query results
   - Performance benchmarking
   - Data integrity checks

5. **Gradual Rollout**
   - Enable for read operations
   - Enable for write operations
   - Remove TypeORM code

### Feature Flag

Use `VENDURE_ENABLE_PRISMA` environment variable:

```bash
# Enable Prisma (default: false)
VENDURE_ENABLE_PRISMA=true

# Or in code
if (process.env.VENDURE_ENABLE_PRISMA === 'true') {
  // Use Prisma
} else {
  // Use TypeORM
}
```

## 📚 Resources

### Prisma Documentation
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Migrations Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Vendure Resources
- [PHASE2_PRISMA_MIGRATION.md](../../../PHASE2_PRISMA_MIGRATION.md) - Complete migration plan
- [TypeORM Entities](../src/entity/) - Current entity definitions

## 🆘 Troubleshooting

### Common Issues

#### "Prisma Client not generated"
```bash
npm run prisma:generate
```

#### "Database schema out of sync"
```bash
# Dev: Push without migration
npm run prisma:db:push

# Production: Create proper migration
npm run prisma:migrate:dev --name fix_schema
```

#### "Cannot connect to database"
Check your `DATABASE_URL` in `.env` file.

#### "Migration failed"
```bash
# Reset migrations (DEV ONLY)
npm run prisma:migrate:reset

# Or manually fix in database and mark as applied
npx prisma migrate resolve --applied "MIGRATION_NAME"
```

### Performance Issues

- Use `include` and `select` to fetch only needed data
- Use proper indexes (check with `EXPLAIN ANALYZE`)
- Enable query logging to identify slow queries:

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## 📊 Monitoring

### Query Logging

```typescript
// Enable in development
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

### Metrics

Prisma provides built-in metrics:

```typescript
const metrics = await prisma.$metrics.json();
console.log(metrics);
```

## 🤝 Contributing

When adding new entities to the schema:

1. Follow naming conventions
2. Add proper indexes
3. Document complex relations
4. Update this README
5. Create migration: `npm run prisma:migrate:dev --name add_entity_name`
6. Test thoroughly

## 📅 Roadmap

- [x] Phase 2.1: Schema design
- [x] Phase 2.2: Migration strategy
- [ ] Phase 2.3: Customer + Address migration
- [ ] Phase 2.4: Product + Order migration
- [ ] Phase 2.5: All 74 entities
- [ ] Phase 2.6: Service layer refactoring
- [ ] Phase 2.7: Custom fields optimization
