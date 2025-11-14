# Phase 2: Prisma ORM Migration Plan

## 🎯 Objectives

Migrate Vendure from TypeORM to Prisma ORM to achieve:
- **Better type safety** with auto-generated types
- **Improved query performance** with Prisma's optimized engine
- **Better developer experience** with intuitive API
- **Easier migrations** with declarative schema
- **Better relation handling** and query optimization

## 📋 Migration Overview

### Timeline: 3-4 weeks

### Phases:
1. **Phase 2.1**: Design Prisma Schema ✅ (Current)
2. **Phase 2.2**: Create Migration Strategy
3. **Phase 2.3**: Pilot Migration (Customer + Address)
4. **Phase 2.4**: Core Entity Migration (Product + Order)
5. **Phase 2.5**: Full Entity Migration (74 entities)
6. **Phase 2.6**: Service Layer Refactoring
7. **Phase 2.7**: Custom Fields System Migration

---

## 🏗️ Architecture Decisions

### 1. Dual ORM Strategy (Incremental Migration)

We'll run TypeORM and Prisma side-by-side during migration:

```
┌─────────────────────────────────────────┐
│         NestJS Application              │
├─────────────────────────────────────────┤
│  Services (Business Logic)              │
├──────────────┬──────────────────────────┤
│  TypeORM     │  Prisma Client           │
│  (Legacy)    │  (New)                   │
├──────────────┴──────────────────────────┤
│         Database (PostgreSQL/MySQL)     │
└─────────────────────────────────────────┘
```

**Benefits:**
- Zero downtime migration
- Easy rollback at any point
- Test Prisma alongside TypeORM
- Gradual service migration

### 2. Schema-First Approach

1. Design complete Prisma schema upfront
2. Generate Prisma Client
3. Create compatibility layer for existing services
4. Migrate services incrementally

### 3. Database Strategy

**Option A: Introspection (RECOMMENDED)**
- Use Prisma's `db pull` to introspect existing database
- Refine schema to match Vendure conventions
- Generate migrations from refined schema

**Option B: Schema-First**
- Design Prisma schema from TypeORM entities
- Generate migrations
- Apply to existing database

**Decision: Use Option A** for accuracy with existing database structure.

---

## 📐 Prisma Schema Design

### Base Schema Structure

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/client"
  previewFeatures = ["multiSchema", "views"]
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}
```

### Entity Mapping Strategy

#### TypeORM → Prisma Mapping Rules

| TypeORM Feature | Prisma Equivalent | Notes |
|----------------|-------------------|-------|
| `@Entity()` | `model` | Direct mapping |
| `@Column()` | field with type | Auto-mapped |
| `@PrimaryGeneratedColumn()` | `@id @default(autoincrement())` | Configurable strategy |
| `@CreateDateColumn()` | `@default(now())` | On Date field |
| `@UpdateDateColumn()` | `@updatedAt` | Auto-maintained |
| `@ManyToOne()` | Relation with foreign key | Explicit FK |
| `@OneToMany()` | Relation (reverse side) | Virtual field |
| `@ManyToMany()` | Implicit join table | Or explicit model |
| `@JoinTable()` | Relation fields | Auto-handled |
| `@Index()` | `@@index([])` | Model-level |
| Soft Delete | `deletedAt DateTime?` | Manual handling |
| Custom Fields | JSON or separate table | TBD |

---

## 🎯 Phase 2.3: Pilot Migration (Customer + Address)

### Why Customer + Address?

1. **Relatively simple** - No complex computed fields
2. **Good relationship example** - OneToMany relationship
3. **Has custom fields** - Tests extensibility system
4. **High impact** - Core entity used throughout
5. **Soft delete** - Tests soft delete pattern

### Schema Design

```prisma
model Customer {
  id           String   @id @default(cuid())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  deletedAt    DateTime?

  title        String?
  firstName    String
  lastName     String
  phoneNumber  String?
  emailAddress String   @unique

  // Relations
  addresses    Address[]
  orders       Order[]
  user         User?     @relation(fields: [userId], references: [id])
  userId       String?   @unique

  // Many-to-Many
  groups       CustomerGroupMembership[]
  channels     CustomerChannel[]

  // Custom fields (JSON for flexibility)
  customFields Json?

  @@index([emailAddress])
  @@index([deletedAt])
  @@map("customer")
}

model Address {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  fullName    String   @default("")
  company     String   @default("")
  streetLine1 String
  streetLine2 String   @default("")
  city        String   @default("")
  province    String   @default("")
  postalCode  String   @default("")
  phoneNumber String   @default("")

  defaultShippingAddress Boolean @default(false)
  defaultBillingAddress  Boolean @default(false)

  // Relations
  customer    Customer @relation(fields: [customerId], references: [id])
  customerId  String

  country     Country  @relation(fields: [countryId], references: [id])
  countryId   String

  // Custom fields
  customFields Json?

  @@index([customerId])
  @@index([countryId])
  @@map("address")
}

// Join table for Customer <-> CustomerGroup
model CustomerGroupMembership {
  customer   Customer      @relation(fields: [customerId], references: [id])
  customerId String

  group      CustomerGroup @relation(fields: [groupId], references: [id])
  groupId    String

  @@id([customerId, groupId])
  @@map("customer_group_membership")
}

// Join table for Customer <-> Channel
model CustomerChannel {
  customer   Customer @relation(fields: [customerId], references: [id])
  customerId String

  channel    Channel  @relation(fields: [channelId], references: [id])
  channelId  String

  @@id([customerId, channelId])
  @@map("customer_channel")
}
```

### Migration Steps

1. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

2. **Create Prisma Service**
   ```typescript
   // packages/core/src/connection/prisma.service.ts
   import { Injectable, OnModuleInit } from '@nestjs/common';
   import { PrismaClient } from '@prisma/client';

   @Injectable()
   export class PrismaService extends PrismaClient implements OnModuleInit {
     async onModuleInit() {
       await this.$connect();
     }

     async onModuleDestroy() {
       await this.$disconnect();
     }
   }
   ```

3. **Create Compatibility Layer**
   ```typescript
   // packages/core/src/service/helpers/customer-prisma.adapter.ts
   export class CustomerPrismaAdapter {
     // Convert TypeORM Customer to Prisma Customer
     // Convert Prisma Customer to TypeORM Customer (for backward compat)
   }
   ```

4. **Update CustomerService**
   - Add Prisma queries alongside TypeORM
   - Add feature flag to switch between implementations
   - Test both implementations in parallel

---

## 🎯 Phase 2.4: Core Entity Migration (Product + Order)

### Product Entity (Complex Case)

**Challenges:**
- Translatable fields (name, slug, description)
- Multiple one-to-many relations (variants, assets, optionGroups)
- Many-to-many relations (facetValues, channels)
- Soft delete
- Custom fields

**Strategy:**
- Use separate translation table
- Use explicit join tables for many-to-many
- Custom fields as JSON initially, migrate to separate table later

### Order Entity (Most Complex)

**Challenges:**
- Self-referential relation (aggregateOrder)
- Multiple calculated fields
- Complex state machine
- Money fields with currency
- Relations to 10+ other entities

**Strategy:**
- Start with basic fields
- Add relations incrementally
- Use Prisma's computed fields for calculations
- Custom decorators for money fields

---

## 🎯 Phase 2.5: Full Entity Migration (74 Entities)

### Entity Categories

#### 1. **Simple Entities** (20 entities)
- Tag, TaxCategory, Zone, Country, Province, Region
- StockLocation, Seller
- SettingsStoreEntry

#### 2. **Translatable Entities** (15 entities)
- Product, ProductOption, ProductOptionGroup, ProductVariant
- Collection, Facet, FacetValue
- PaymentMethod, ShippingMethod, Promotion

#### 3. **Complex Relations** (20 entities)
- Order, OrderLine, OrderModification
- Payment, Refund, Fulfillment
- ShippingLine, Surcharge

#### 4. **Inheritance Hierarchies** (10 entities)
- Session → AnonymousSession, AuthenticatedSession
- AuthenticationMethod → NativeAuth, ExternalAuth
- StockMovement → Allocation, Release, Sale, Cancellation, StockAdjustment
- HistoryEntry → CustomerHistoryEntry, OrderHistoryEntry

#### 5. **Join Tables & Assets** (9 entities)
- ProductAsset, ProductVariantAsset, CollectionAsset
- FulfillmentLine, RefundLine, OrderModificationLine, OrderLineReference

### Migration Order

```
1. Base entities (no dependencies)
   - Tag, Zone, Country, Province, Region

2. User & Auth
   - User, Administrator, Role
   - AuthenticationMethod, NativeAuthenticationMethod, ExternalAuthenticationMethod

3. Channel & Settings
   - Channel, GlobalSettings, SettingsStoreEntry, Seller

4. Catalog (Products)
   - Asset, ProductOptionGroup, ProductOption
   - Product, ProductVariant, ProductTranslation
   - ProductAsset, ProductVariantAsset, ProductVariantPrice

5. Taxonomy
   - Facet, FacetValue, FacetTranslation
   - Collection, CollectionAsset, CollectionTranslation
   - TaxCategory, TaxRate

6. Customer
   - Customer, CustomerGroup, Address

7. Orders
   - Order, OrderLine, OrderLineReference
   - Payment, PaymentMethod, Refund, RefundLine
   - Fulfillment, FulfillmentLine
   - ShippingMethod, ShippingLine
   - Promotion, Surcharge
   - OrderModification, OrderModificationLine

8. Inventory
   - StockLocation, StockLevel
   - StockMovement, Allocation, Release, Sale, Cancellation, StockAdjustment

9. History & Sessions
   - Session, AnonymousSession, AuthenticatedSession
   - HistoryEntry, CustomerHistoryEntry, OrderHistoryEntry
```

---

## 🎯 Phase 2.6: Service Layer Refactoring

### Service Migration Strategy

1. **Create Prisma-based repositories**
   ```typescript
   @Injectable()
   export class CustomerPrismaRepository {
     constructor(private prisma: PrismaService) {}

     async findOne(id: string) {
       return this.prisma.customer.findUnique({ where: { id } });
     }
   }
   ```

2. **Adapter Pattern**
   ```typescript
   @Injectable()
   export class CustomerService {
     constructor(
       private typeormRepo: CustomerRepository, // Legacy
       private prismaRepo: CustomerPrismaRepository, // New
       private config: ConfigService,
     ) {}

     async findOne(id: string) {
       if (this.config.usePrisma) {
         return this.prismaRepo.findOne(id);
       }
       return this.typeormRepo.findOne(id);
     }
   }
   ```

3. **Gradual Migration**
   - Add feature flag `VENDURE_ENABLE_PRISMA`
   - Migrate read operations first
   - Then migrate write operations
   - Remove TypeORM code once stable

### Services to Migrate

1. **EntityService** (base service)
2. **ListQueryBuilder** (pagination & filtering)
3. **CustomerService**
4. **ProductService**
5. **OrderService**
6. **AssetService**
7. All 30+ other services

---

## 🎯 Phase 2.7: Custom Fields System Migration

### Current System (TypeORM)

```typescript
// Defined at runtime via config
customFields: {
  Customer: [
    { name: 'loyaltyPoints', type: 'int', defaultValue: 0 },
  ],
}

// Stored as JSON in database
@Column(type => CustomCustomerFields)
customFields: CustomCustomerFields;
```

### Prisma Options

#### Option 1: JSON Fields (Simpler, Less Type-Safe)

```prisma
model Customer {
  // ... other fields
  customFields Json?
}
```

**Pros:**
- Easy to implement
- Flexible schema
- No migrations needed for new fields

**Cons:**
- No type safety
- No database constraints
- Harder to query

#### Option 2: Separate Tables (Better, More Complex)

```prisma
model Customer {
  // ... other fields
  customFields CustomerCustomField?
}

model CustomerCustomField {
  id         String   @id @default(cuid())
  customer   Customer @relation(fields: [customerId], references: [id])
  customerId String   @unique

  // Define all possible custom fields
  loyaltyPoints Int?
  vipStatus     String?
  notes         String?

  @@map("customer_custom_fields")
}
```

**Pros:**
- Type-safe
- Queryable
- Database constraints

**Cons:**
- Requires migration for new fields
- Less flexible

#### Option 3: Hybrid Approach (RECOMMENDED)

```prisma
model Customer {
  // ... other fields
  customFields        Json?  // For user-defined fields
  standardCustomFields CustomerCustomField?  // For commonly used fields
}

model CustomerCustomField {
  id              String   @id
  customer        Customer @relation(fields: [id], references: [id])

  // Common custom fields with proper types
  loyaltyPoints   Int      @default(0)
  vipStatus       String?
  birthday        DateTime?
  referralCode    String?

  @@map("customer_custom_fields")
}
```

**Strategy:**
1. Start with JSON (Option 1) for quick migration
2. Identify most-used custom fields
3. Move them to typed table (Option 3)
4. Keep rare/dynamic fields as JSON

---

## 🔧 Technical Implementation

### 1. Project Setup

```bash
# Install Prisma
npm install prisma @prisma/client --workspace=@vendure/core

# Initialize Prisma
cd packages/core
npx prisma init
```

### 2. Configuration

```typescript
// packages/core/src/config/vendure-config.ts
export interface VendureConfig {
  // ... existing config

  // New Prisma config
  prisma?: {
    enabled: boolean;
    schemaPath?: string;
    logQueries?: boolean;
  };
}
```

### 3. Module Setup

```typescript
// packages/core/src/connection/prisma.module.ts
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// packages/core/src/app.module.ts
@Module({
  imports: [
    // ... existing imports
    PrismaModule,
  ],
})
export class AppModule {}
```

### 4. Migration Commands

```bash
# Pull existing database schema
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# View data in Prisma Studio
npx prisma studio
```

---

## 🧪 Testing Strategy

### 1. Unit Tests

- Test Prisma repositories independently
- Mock PrismaClient
- Test adapters between TypeORM and Prisma

### 2. Integration Tests

- Run both TypeORM and Prisma queries
- Compare results
- Ensure data consistency

### 3. E2E Tests

- Use feature flag to test both implementations
- Ensure API behavior is identical
- Performance benchmarks

### 4. Migration Tests

```typescript
describe('Customer Migration', () => {
  it('should migrate all customers from TypeORM to Prisma', async () => {
    // 1. Fetch all from TypeORM
    const typeormCustomers = await typeormRepo.find();

    // 2. Migrate to Prisma
    for (const customer of typeormCustomers) {
      await prismaRepo.create(adaptCustomer(customer));
    }

    // 3. Verify data integrity
    const prismaCustomers = await prismaRepo.findAll();
    expect(prismaCustomers.length).toBe(typeormCustomers.length);
  });
});
```

---

## 📊 Success Metrics

### Performance Goals

- **Query Performance**: 20-30% faster
- **Type Safety**: 100% type coverage
- **Developer Experience**: Reduced boilerplate by 40%
- **Build Time**: No impact (or faster with code generation)

### Quality Gates

- [ ] All unit tests pass with Prisma
- [ ] All E2E tests pass with Prisma
- [ ] Performance benchmarks meet goals
- [ ] Zero data loss in migration
- [ ] API behavior identical to TypeORM version

---

## 🚨 Risk Mitigation

### Risks

1. **Data Loss**: During migration
2. **Performance Degradation**: New ORM might be slower
3. **Breaking Changes**: API incompatibilities
4. **Learning Curve**: Team unfamiliar with Prisma

### Mitigation

1. **Comprehensive Testing**: Unit, integration, E2E
2. **Feature Flags**: Easy rollback
3. **Parallel Running**: Compare results
4. **Staged Rollout**: Pilot → Core → Full
5. **Documentation**: Detailed migration guides
6. **Team Training**: Prisma workshops

---

## 📚 Resources

### Prisma Documentation

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Migrating from TypeORM](https://www.prisma.io/docs/guides/migrate-to-prisma/migrate-from-typeorm)

### Vendure Documentation

- [Entity Reference](https://docs.vendure.io/reference/typescript-api/entities/)
- [Database Configuration](https://docs.vendure.io/guides/developer-guide/database-entity/)

---

## ✅ Phase 2.1 Deliverables

- [x] Complete migration plan
- [x] Architecture decisions documented
- [x] Prisma schema designed for pilot entities
- [ ] Initial Prisma setup in @vendure/core
- [ ] PrismaService implementation
- [ ] First migration scripts

**Next Step: Phase 2.2 - Create Migration Strategy**
