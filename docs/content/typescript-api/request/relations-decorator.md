---
title: "Relations Decorator"
weight: 10
date: 2023-07-04T11:02:11.587Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Relations Decorator
<div class="symbol">


# Relations

{{< generation-info sourceFile="packages/core/src/api/decorators/relations.decorator.ts" sourceLine="134" packageName="@vendure/core" since="1.6.0">}}

Resolver param decorator which returns an array of relation paths which can be passed through
to the TypeORM data layer in order to join only the required relations. This works by inspecting
the GraphQL `info` object, examining the field selection, and then comparing this with information
about the return type's relations.

In addition to analyzing the field selection, this decorator also checks for any `@Calculated()`
properties on the entity, and additionally includes relations from the `relations` array of the calculated
metadata, if defined.

So if, for example, the query only selects the `id` field of an Order, then no other relations need
be joined in the resulting SQL query. This can massively speed up execution time for queries which do
not include many deep nested relations.

*Example*

```TypeScript
@Query()
@Allow(Permission.ReadOrder)
orders(
    @Ctx() ctx: RequestContext,
    @Args() args: QueryOrdersArgs,
    @Relations(Order) relations: RelationPaths<Order>,
): Promise<PaginatedList<Order>> {
    return this.orderService.findAll(ctx, args.options || undefined, relations);
}
```

In the above example, given the following query:

*Example*

```GraphQL
{
  orders(options: { take: 10 }) {
    items {
      id
      customer {
        id
        firstName
        lastName
      }
      totalQuantity
      totalWithTax
    }
  }
}
```
then the value of `relations` will be

```
['customer', 'lines'']
```
The `'customer'` comes from the fact that the query is nesting the "customer" object, and the `'lines'` is taken
from the `Order` entity's `totalQuantity` property, which uses <a href='/typescript-api/data-access/calculated#calculated'>Calculated</a> decorator and defines those relations as dependencies
for deriving the calculated value.

## Depth

By default, when inspecting the GraphQL query, the Relations decorator will look 3 levels deep in any nested fields. So, e.g. if
the above `orders` query were changed to:

*Example*

```GraphQL
{
  orders(options: { take: 10 }) {
    items {
      id
      lines {
        productVariant {
          product {
            featuredAsset {
              preview
            }
          }
        }
      }
    }
  }
}
```
then the `relations` array would include `'lines'`, `'lines.productVariant'`, & `'lines.productVariant.product'` - 3 levels deep - but it would
_not_ include `'lines.productVariant.product.featuredAsset'` since that exceeds the default depth. To specify a custom depth, you would
use the decorator like this:

*Example*

```TypeScript
@Relations({ entity: Order, depth: 2 }) relations: RelationPaths<Order>,
```

## Omit

The `omit` option is used to explicitly omit certain relations from the calculated relations array. This is useful in certain
cases where we know for sure that we need to run the field resolver _anyway_. A good example is the `Collection.productVariants` relation.
When a GraphQL query comes in for a Collection and also requests its `productVariants` field, there is no point using a lookahead to eagerly
join that relation, because we will throw that data away anyway when the `productVariants` field resolver executes, since it returns a
PaginatedList query rather than a simple array.

*Example*

```TypeScript
@Relations({ entity: Collection, omit: ['productVariant'] }) relations: RelationPaths<Collection>,
```

</div>
