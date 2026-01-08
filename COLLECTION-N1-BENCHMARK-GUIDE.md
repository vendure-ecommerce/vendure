# Collection N+1 Query Benchmark Guide

This guide provides a comprehensive benchmarking solution for the Collections list N+1 query issue.

## 🎯 Quick Start

### Run Quick Test (Fastest - 30 seconds)

```bash
cd packages/core
npm run e2e collection-n-plus-one-quick.e2e-spec.ts
```

This provides immediate feedback on query counts during development.

### Run Full Benchmark (Complete - 2-3 minutes)

```bash
cd packages/core
npm run bench collection-n-plus-one.bench.ts
```

This provides detailed performance metrics and query analysis.

## 📁 Files Created

### 1. Benchmark Files

**`packages/core/e2e/collection-n-plus-one.bench.ts`**
- Full benchmark suite with performance measurements
- Detailed query analysis
- Execution time tracking
- Uses tinybench for statistical analysis

**`packages/core/e2e/collection-n-plus-one-quick.e2e-spec.ts`**
- Quick query counter for rapid iteration
- Faster setup (5 collections vs 10)
- Immediate console feedback
- Perfect for TDD-style development

**`packages/core/e2e/COLLECTION-N1-BENCHMARK.md`**
- Comprehensive documentation
- How to interpret results
- Implementation strategies
- Validation checklist

### 2. Key Files to Modify

When implementing the fix, you'll primarily work with:

- **GraphQL Query**: `packages/dashboard/src/app/routes/_authenticated/_collections/collections.graphql.ts`
- **Service**: `packages/core/src/service/services/collection.service.ts`
- **Resolver**: `packages/core/src/api/resolvers/admin/collection.resolver.ts` (likely location)
- **Entity**: `packages/core/src/entity/collection/collection.entity.ts`

## 🔄 Development Workflow

### Step 1: Establish Baseline

```bash
cd packages/core
npm run e2e collection-n-plus-one-quick.e2e-spec.ts
```

Record the output:
```
==================================================
COLLECTION N+1 QUERY TEST
==================================================
Collections returned:     10
Total queries:            35
N+1 queries detected:     10
Query efficiency:         3.50 per collection
==================================================
```

### Step 2: Implement Fix

Work on your implementation in the service/resolver layer. Common approaches:

**Option A: DataLoader (Recommended)**
```typescript
// Create a DataLoader to batch product variant counts
const variantCountLoader = new DataLoader(async (collectionIds: ID[]) => {
  // Single query that fetches counts for all collections
  const counts = await connection.query(`
    SELECT collection_id, COUNT(*) as count
    FROM collection_product_variants
    WHERE collection_id IN (?)
    GROUP BY collection_id
  `, [collectionIds]);
  // Return array in same order as input
  return collectionIds.map(id => counts.find(c => c.collection_id === id)?.count || 0);
});
```

**Option B: Eager Loading with Join**
```typescript
// In collection.service.ts
qb.leftJoin('collection.productVariants', 'variant')
  .addSelect('COUNT(variant.id)', 'collection_variantCount')
  .groupBy('collection.id');
```

### Step 3: Test Changes

Run the quick test after each change:

```bash
npm run e2e collection-n-plus-one-quick.e2e-spec.ts
```

Look for:
- ✅ N+1 queries reduced from 10 → 0
- ✅ Total queries reduced
- ✅ Query efficiency improved

### Step 4: Validate with Full Benchmark

Once you see improvement in the quick test, run the full benchmark:

```bash
npm run bench collection-n-plus-one.bench.ts
```

This provides:
- Performance timing data
- Statistical analysis (mean, std dev, min/max)
- Query pattern analysis
- Detailed breakdown

### Step 5: Test with Different Databases

```bash
# Test with PostgreSQL (recommended for production validation)
DB=postgres npm run e2e collection-n-plus-one-quick.e2e-spec.ts

# Test with MySQL
DB=mysql npm run e2e collection-n-plus-one-quick.e2e-spec.ts
```

## 📊 Understanding Results

### Before Fix (Expected)

```
Collections returned:     10
Total queries:            35
N+1 queries detected:     10  ← One per collection!
Query efficiency:         3.50 per collection
```

**What's happening:**
- Main query fetches collections: ~5 queries
- For each collection, a separate query counts variants: 10 queries (N+1!)
- Additional queries for relations: ~20 queries

### After Fix (Target)

```
Collections returned:     10
Total queries:            15
N+1 queries detected:     0   ← Fixed!
Query efficiency:         1.50 per collection
```

**What changed:**
- Main query fetches collections: ~5 queries
- Single bulk query for all variant counts: 1 query (no more N+1!)
- Additional queries for relations: ~9 queries

### Success Criteria

✅ **N+1 queries**: Must be **0**
✅ **Query efficiency**: Should be **<2.0** per collection
✅ **Total queries**: Reduced by ~30-50%
✅ **Correctness**: All variant counts still accurate

## 🧪 Testing Different Scenarios

### Test with More Collections

Edit the quick test to create more collections:

```typescript
// In collection-n-plus-one-quick.e2e-spec.ts
for (let i = 0; i < 20; i++) {  // Changed from 5 to 20
  // ... create collection
}
```

This helps verify the fix scales properly.

### Test with Empty Collections

Verify the fix works when collections have no variants:

```typescript
await adminClient.query(CREATE_COLLECTION, {
  input: {
    filters: [],  // No filters = empty collection
    translations: [/* ... */],
  },
});
```

### Test with Large Collections

Use collections with many variants to test performance under load.

## 🐛 Debugging Tips

### Enable SQL Logging

```typescript
// In test file, add:
const dataSource = connection.rawConnection;
console.log('Queries:', queryLogger.getQueries());
```

### Print Query Patterns

```bash
npm run e2e collection-n-plus-one-quick.e2e-spec.ts 2>&1 | grep "SELECT"
```

### Compare SQL

Before and after fix, save the queries to files:

```bash
# Before
npm run e2e collection-n-plus-one-quick.e2e-spec.ts > before-queries.log 2>&1

# After
npm run e2e collection-n-plus-one-quick.e2e-spec.ts > after-queries.log 2>&1

# Compare
diff before-queries.log after-queries.log
```

## 📈 Performance Expectations

Based on typical N+1 fixes:

| Collections | Before (ms) | After (ms) | Improvement |
|-------------|-------------|------------|-------------|
| 10          | ~150ms      | ~50ms      | 66%         |
| 50          | ~600ms      | ~120ms     | 80%         |
| 100         | ~1200ms     | ~180ms     | 85%         |

Performance improves dramatically as collection count increases!

## ✅ Final Validation Checklist

Before closing the issue:

- [ ] Quick test shows 0 N+1 queries
- [ ] Full benchmark confirms performance improvement
- [ ] Tested with PostgreSQL and MySQL
- [ ] Tested with 10, 50, and 100 collections
- [ ] Dashboard UI displays correct counts
- [ ] All existing e2e tests pass
- [ ] No performance regressions in other queries
- [ ] Code reviewed for correctness

## 🚀 Running All Tests

```bash
# Quick test
npm run e2e collection-n-plus-one-quick.e2e-spec.ts

# Full benchmark
npm run bench collection-n-plus-one.bench.ts

# All collection tests
npm run e2e collection.e2e-spec.ts

# Full e2e suite
npm run e2e
```

## 📝 Documenting Your Fix

After implementing the fix, update this file with:

1. **Before/After metrics** from your environment
2. **Implementation approach** used
3. **Any gotchas** or edge cases discovered
4. **Performance improvements** observed

## 🎓 Learning Resources

- [Solving the N+1 Problem](https://shopify.engineering/solving-the-n-1-problem-for-graphql-through-batching)
- [DataLoader Documentation](https://github.com/graphql/dataloader)
- [TypeORM Query Optimization](https://typeorm.io/select-query-builder#joining-relations)

## 💡 Tips for Success

1. **Start with the quick test** - it's fast and gives immediate feedback
2. **Make small changes** - test after each modification
3. **Check correctness first** - ensure counts are still accurate
4. **Then optimize** - once correct, focus on performance
5. **Document your approach** - help future developers understand the fix

---

**Questions or Issues?**

If you encounter problems with the benchmarks or need help interpreting results, check:
- `packages/core/e2e/COLLECTION-N1-BENCHMARK.md` for detailed documentation
- The benchmark source code for implementation details
- Existing collection tests for patterns and examples
