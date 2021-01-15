---
title: "Extending the GraphQL API"
showtoc: true
---

# Extending the GraphQL API

There are a number of ways the GraphQL APIs can be modified by a plugin.

## Adding a new Query or Mutation

This example adds a new query to the GraphQL Admin API. It also demonstrates how [Nest's dependency injection](https://docs.nestjs.com/providers) can be used to encapsulate and inject services within the plugin module.
 
```TypeScript
// top-sellers.resolver.ts
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core'

@Resolver()
class TopSellersResolver {

  constructor(private topSellersService: TopSellersService) {}

  @Query()
  topSellers(@Ctx() ctx: RequestContext, @Args() args: any) {
    return this.topSellersService.getTopSellers(ctx, args.from, args.to);
  }

}
```
{{< alert "primary" >}}
  **Note:** The `@Ctx` decorator gives you access to [the `RequestContext`]({{< relref "request-context" >}}), which is an object containing useful information about the current request - active user, current channel etc.
{{< /alert >}}

```TypeScript
// top-sellers.service.ts
import { Injectable } from '@nestjs/common';
import { RequestContext } from '@vendure/core';

@Injectable()
class TopSellersService {
    getTopSellers(ctx: RequestContext, from: Date, to: Date) { 
        /* ... */
    }
}
```

The GraphQL schema is extended with the `topSellers` query (the query name should match the name of the corresponding resolver method):

```TypeScript
// top-sellers.plugin.ts
import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { TopSellersService } from './top-sellers.service'
import { TopSellersResolver } from './top-sellers.resolver'

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [TopSellersService],
  adminApiExtensions: {
    schema: gql`
      extend type Query {
        topSellers(from: DateTime! to: DateTime!): [Product!]!
    }`,
    resolvers: [TopSellersResolver]
  }
})
export class TopSellersPlugin {}
```

New mutations are defined in the same way, except that the `@Mutation()` decorator is used in the resolver, and the schema Mutation type is extended:

```GraphQL
extend type Mutation { 
    myCustomProductMutation(id: ID!): Product!
}
```

## Add fields to existing types

Let's say you want to add a new field, "availability" to the ProductVariant type, to allow the storefront to display some indication of whether a variant is available to purchase. First you define a resolver function:

```TypeScript
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, ProductVariant } from '@vendure/core';

@Resolver('ProductVariant')
export class ProductVariantEntityResolver {
  
  @ResolveField()
  availability(@Ctx() ctx: RequestContext, @Parent() variant: ProductVariant) {
    return this.getAvailbilityForVariant(ctx, variant.id);
  }
  
  private getAvailbilityForVariant(ctx: RequestContext, id: ID): string {
    // implementation omitted, but calculates the
    // available salable stock and returns a string
    // such as "in stock", "2 remaining" or "out of stock"
  }
}
```

Then in the plugin metadata, we extend the ProductVariant type and pass the resolver:

```TypeScript
import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductVariantEntityResolver } from './product-variant-entity.resolver'

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: gql`
      extend type ProductVariant {
        availability: String!
      }`,
    resolvers: [ProductVariantEntityResolver]
  }
})
export class AvailabilityPlugin {}
```

## Override built-in resolvers

It is also possible to override an existing built-in resolver function with one of your own. To do so, you need to define a resolver with the same name as the query or mutation you wish to override. When that query or mutation is then executed, your code, rather than the default Vendure resolver, will handle it.

```TypeScript
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core'

@Resolver()
class OverrideExampleResolver {

  @Query()
  products(@Ctx() ctx: RequestContext, @Args() args: any) {
    // when the `products` query is executed, this resolver function will
    // now handle it.
  }
  
  @Transaction()
  @Mutation()
  addItemToOrder(@Ctx() ctx: RequestContext, @Args() args: any) {
    // when the `addItemToOrder` mutation is executed, this resolver function will
    // now handle it.
  }

}
```

The same can be done for resolving fields:

```TypeScript
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, Product } from '@vendure/core';

@Resolver('Product')
export class FieldOverrideExampleResolver {
  
  @ResolveField()
  description(@Ctx() ctx: RequestContext, @Parent() variant: Product) {
    return this.wrapInFormatting(ctx, variant.id);
  }
  
  private wrapInFormatting(ctx: RequestContext, id: ID): string {
    // implementation omitted, but wraps the description
    // text in some special formatting required by the storefront
  }
}
```

