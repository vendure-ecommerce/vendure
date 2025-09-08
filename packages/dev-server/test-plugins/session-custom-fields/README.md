# Session Custom Fields Test Plugin

This test plugin demonstrates and validates the fix for Session custom fields relations in Vendure.

## Problem

Session entities could not properly **load** custom field relations when using direct repository queries. The issue was specific to **reading/loading** Session custom field relations, not saving them.

The original error was:
```
Relation with property path customFields in entity was not found
```

This occurred because Session.customFields is an embedded entity, not a regular relation, requiring special handling in TypeORM queries.

## Solution

Added specialized methods to `SessionService` to handle embedded custom field relations for **loading operations**:

- `findSessionsWithRelations()` - Find multiple sessions with custom field relations
- `findSessionWithRelations()` - Find single session with custom field relations  
- `buildSessionQueryWithCustomFields()` - Build proper queries for embedded relations
- `mapCustomFieldRelationsToSessions()` - Map raw query results to entity structure

All methods are marked as `@internal` and `@since 3.4.1`.

**Note:** Session custom fields are properly preserved during save operations (`setActiveOrder`, `setActiveChannel`) even with standard repository methods. The fix is specifically for loading/reading custom field relations.

## Plugin Structure

```
session-custom-fields/
├── README.md                          # This documentation
├── example.plugin.ts                  # Main plugin file
├── types.ts                           # TypeScript definitions
├── entities/
│   └── example.entity.ts              # SessionCustomFieldsTestEntity for testing
├── services/
│   └── example.service.ts             # SessionCustomFieldsTestService with examples
├── test/
│   ├── test-script.ts                 # Main test demonstrating the fix
│   └── test-updates.ts                # Test that custom fields persist during updates
└── debug-scripts/
    ├── debug-script.ts                # Debug utilities
    ├── debug-mapping.ts               # Raw data mapping debug
    └── debug-raw.ts                   # Raw query debug
```

## Entities

### SessionCustomFieldsTestEntity
A simple test entity used to create relations with Session and Product entities.

```typescript
@Entity('example') // Keeps original table name for consistency
export class SessionCustomFieldsTestEntity extends VendureEntity {
    @Column()
    code: string;
}
```

## Custom Fields Configuration

The plugin adds custom relation fields to both Session and Product entities for comparison:

```typescript
// Session custom field (requires special handling)
config.customFields.Session.push({
    name: 'example',
    type: 'relation',
    entity: SessionCustomFieldsTestEntity,
    internal: true,
    nullable: true,
});

// Product custom field (works normally)
config.customFields.Product.push({
    name: 'example', 
    type: 'relation',
    entity: SessionCustomFieldsTestEntity,
    internal: true,
    nullable: true,
});
```

## Usage Examples

### ❌ Wrong Way (Direct Repository Query)
```typescript
// This will NOT load custom field relations
const sessions = await connection.getRepository(ctx, Session).find({
    relations: {
        customFields: {
            example: true,
        },
    },
});
// Result: { customFields: { "__fix_relational_custom_fields__": null } }
```

### ✅ Correct Way (Using SessionService)
```typescript
// This WILL load custom field relations properly
const sessions = await sessionService.findSessionsWithRelations(ctx, {
    relations: ['customFields.example'],
    take: 10,
});
// Result: { customFields: { example: { id: 1, code: "EXAMPLE_001", ... } } }
```

## Available SessionService Methods

### 1. `findSessionsWithRelations()`
Find multiple sessions with custom field relations:
```typescript
const sessions = await sessionService.findSessionsWithRelations(ctx, {
    where: { invalidated: false },
    relations: ['customFields.example'],
    take: 10,
    skip: 0,
    order: { createdAt: 'DESC' }
});
```

### 2. `findSessionWithRelations()`
Find a single session with custom field relations:
```typescript
const session = await sessionService.findSessionWithRelations(
    ctx, 
    { id: sessionId }, 
    ['customFields.example']
);
```

## Testing

### Run Basic Test
```bash
# Navigate to test directory
cd packages/dev-server/test-plugins/session-custom-fields/test

# Run with Node 20 and correct database settings
source ~/.nvm/nvm.sh && nvm use 20 && DB=postgres DB_PORT=5433 node -r ts-node/register test-script.ts
```

### Run Update Preservation Test
```bash
# Test that custom fields persist during Session updates
source ~/.nvm/nvm.sh && nvm use 20 && DB=postgres DB_PORT=5433 node -r ts-node/register test-updates.ts
```

## Test Results

### ✅ Custom Field Loading Test
- **Direct Repository Query:** Shows only `{"__fix_relational_custom_fields__": null}` ❌
- **SessionService.findSessionsWithRelations:** Shows full relation data ✅
- **Product Query (comparison):** Shows relation data normally ✅

### ✅ Update Operations Test
- **setActiveChannel:** Custom fields preserved even with original repository methods ✅
- **Final verification:** All custom field data intact ✅
- **Important:** TypeORM's save() operation naturally preserves custom fields - no special handling needed

## Technical Details

### Why This Fix Was Needed

1. **Embedded vs Regular Relations:** Session.customFields is an embedded entity, not a regular relation
2. **TypeORM Limitation:** `leftJoinAndSelect('session.customFields', ...)` fails for embedded entities
3. **Manual Mapping Required:** Must use `getRawAndEntities()` and manually map raw data

### Implementation Approach

1. **Query Building:** Join relations within customFields: `session.customFields.example`
2. **Raw Data Extraction:** Use `getRawAndEntities()` to get both entities and raw column data
3. **Manual Mapping:** Extract prefixed columns (`customFields_example_*`) and map to entity structure
4. **Backwards Compatibility:** Falls back to `getMany()` if no custom field relations exist

### Files Modified in Core

- `packages/core/src/service/services/session.service.ts`
  - Added 4 core methods for handling Session custom field relations:
    - `findSessionsWithRelations()` - public method for loading multiple sessions
    - `findSessionWithRelations()` - public method for loading single session
    - `buildSessionQueryWithCustomFields()` - private helper for query building
    - `mapCustomFieldRelationsToSessions()` - private helper for data mapping
  - All methods marked as `@internal` and `@since 3.4.1` for future reference
  - No changes needed to existing save operations (they work naturally)

## Integration

### Add to your vendure-config.ts:
```typescript
import { SessionCustomFieldsTestPlugin } from './test-plugins/session-custom-fields/example.plugin';

export const config: VendureConfig = {
    // ... other config
    plugins: [
        // ... other plugins
        SessionCustomFieldsTestPlugin,
    ],
};
```

### Run database migrations:
```bash
# This will create the example table and custom field columns
npm run migration:generate -- --name="add-session-custom-fields-test"
npm run migration:run
```

## Verification

The fix ensures that:
1. ✅ Session custom field relations load properly (like Product relations)
2. ✅ Custom fields persist during Session update operations (`setActiveOrder`, `setActiveChannel`)
3. ✅ Backwards compatibility maintained for sessions without custom fields
4. ✅ Performance optimized (only uses complex mapping when needed)

## Why Product Custom Fields Work Normally

Product entities don't use embedded customFields in the same way as Session entities. Product custom fields follow the standard TypeORM relation pattern, so normal queries work:

```typescript
// This works for Product (no change needed)
const products = await connection.getRepository(ctx, Product).find({
    relations: {
        customFields: {
            example: true,
        },
    },
});
```

## Notes

- This plugin should remain in the dev environment as a test/reference implementation
- The core SessionService changes are the permanent fix that resolves the issue
- Custom field relations now work consistently across all Vendure entities
- All debug utilities are preserved in `debug-scripts/` folder for future investigation
- Methods are marked `@internal` so you can easily find them in the SessionService code