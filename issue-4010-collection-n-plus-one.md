# Issue #4010: Collection N+1 Query Performance Fix

GitHub: https://github.com/vendure-ecommerce/vendure/issues/4010

## Problem

When listing collections with `productVariants { totalItems }`, the system executes N+1 queries - one count query per collection. With 4000+ collections, this causes server crashes.

## Solution Design

### Core Principle
Batch-fetch variant counts for all collections in a single query at the top-level resolver, cache the promise, and let field resolvers await it.

### Schema Change
Add a dedicated `productVariantCount` field to the Collection type instead of relying on `productVariants(take: 0) { totalItems }` hack:

```graphql
type Collection {
  # ... existing fields
  productVariantCount: Int!
}
```

### Implementation Components

#### 1. ProductVariantService - Batch Count Method (DONE)
Location: `src/service/services/product-variant.service.ts`

```typescript
async getVariantCountsByCollectionIds(
    ctx: RequestContext,
    collectionIds: ID[],
): Promise<Map<ID, number>>
```

Single query with `GROUP BY collection.id` returning counts for all requested collections.

#### 2. Top-Level Resolvers - Cache Promise (DONE, needs update)
Locations:
- `src/api/resolvers/admin/collection.resolver.ts`
- `src/api/resolvers/shop/shop-products.resolver.ts`

Uses `graphql-fields` to check if `productVariantCount` is requested, then caches the promise (not awaited):

```typescript
const fields = graphqlFields(info);
const itemFields = fields.items ?? {};
if ('productVariantCount' in itemFields) {
    const collectionIds = result.items.map(c => c.id);
    const variantCountsPromise =
        this.productVariantService.getVariantCountsByCollectionIds(ctx, collectionIds);
    this.requestContextCache.set(ctx, COLLECTION_VARIANT_COUNTS_CACHE_KEY, variantCountsPromise);
}
```

#### 3. Entity Resolver - New Field (TODO)
Location: `src/api/resolvers/entity/collection-entity.resolver.ts`

Add new `productVariantCount` field resolver:

```typescript
@ResolveField()
async productVariantCount(
    @Ctx() ctx: RequestContext,
    @Parent() collection: Collection,
): Promise<number> {
    // Check for cached promise from batch-fetch (list queries)
    const cachedPromise = this.requestContextCache.get<Promise<Map<ID, number>>>(
        ctx,
        COLLECTION_VARIANT_COUNTS_CACHE_KEY,
    );
    if (cachedPromise) {
        const counts = await cachedPromise;
        return counts.get(collection.id) ?? 0;
    }
    // Fallback for single collection queries - fetch individually
    return this.productVariantService.getVariantCountByCollectionId(ctx, collection.id);
}
```

Remove the `take === 0` hack from `productVariants` resolver.

#### 4. GraphQL Schema (TODO)
Add `productVariantCount: Int!` to Collection type in:
- `src/api/schema/admin-api/collection.api.graphql`
- `src/api/schema/shop-api/collection.api.graphql` (if applicable)

#### 5. ProductVariantService - Single Count Method (TODO)
Add fallback method for single collection queries:

```typescript
async getVariantCountByCollectionId(ctx: RequestContext, collectionId: ID): Promise<number>
```

### Bug Fixes Applied

#### RequestContextCacheService Falsy Value Bug (DONE)
Location: `src/cache/request-context-cache.service.ts`

Fixed `get()` method - was using `if (result)` which fails for falsy values like `0`. Changed to `if (ctxCache.has(key))`.

## Test Coverage

Location: `e2e/collection-n-plus-one.e2e-spec.ts`

Tests:
1. N+1 detection - verifies batch query eliminates N+1 pattern
2. Conditional batch-fetch - verifies batch query only runs when `productVariantCount` requested

## Performance Results

| Scenario | Queries (Before) | Queries (After) |
|----------|------------------|-----------------|
| 16 collections with counts | 38 | 4 |
| 16 collections without counts | 3 | 3 |

## Remaining Work

1. [ ] Add `productVariantCount` to GraphQL schema
2. [ ] Add `productVariantCount` field resolver
3. [ ] Add `getVariantCountByCollectionId` fallback method
4. [ ] Remove `take === 0` hack from `productVariants` resolver
5. [ ] Update top-level resolvers to check for `productVariantCount` instead of `productVariants.totalItems`
6. [ ] Update tests to use new field
7. [ ] Run codegen
8. [ ] Consider shop API implications (enabled filter for counts?)

## Files Modified

- `src/service/services/product-variant.service.ts` - batch count method
- `src/api/resolvers/admin/collection.resolver.ts` - promise caching
- `src/api/resolvers/shop/shop-products.resolver.ts` - promise caching
- `src/api/resolvers/entity/collection-entity.resolver.ts` - cache key export, needs refactor
- `src/cache/request-context-cache.service.ts` - falsy value bug fix
- `e2e/collection-n-plus-one.e2e-spec.ts` - benchmark tests
