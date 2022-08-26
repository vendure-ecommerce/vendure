---
title: "Extending the GraphQL API"
showtoc: true
---

# Extending the GraphQL API

Extension to the GraphQL API consists of two parts:

1. **Schema extensions**. These define new types, fields, queries and mutations.
2. **Resolvers**. These provide the logic that backs up the schema extensions.

The Shop API and Admin APIs can be extended independently:

```TypeScript {hl_lines=["16-22"]}
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import gql from 'graphql-tag';
import { TopSellersResolver } from './top-products.resolver';

const schemaExtension = gql`
  extend type Query {
    topProducts: [Product!]!
  }
`

@VendurePlugin({
  imports: [PluginCommonModule],
  // We pass our schema extension and any related resolvers
  // to our plugin metadata  
  shopApiExtensions: {
    schema: schemaExtension,
    resolvers: [TopProductsResolver],
  },
  // Likewise, if you want to extend the Admin API,
  // you would use `adminApiExtensions` in exactly the
  // same way.  
})
export class TopProductsPlugin {}
```

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

## Defining a new type

If you have [defined a new database entity]({{< relref "defining-db-entity" >}}), it is likely that you'll want to expose this entity in your GraphQL API. To do so, you'll need to define a corresponding GraphQL type:

```TypeScript
import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ReviewsResolver } from './reviews.resolver';
import { ProductReview } from './product-review.entity';

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: gql`
      # This is where we define the GraphQL type
      # which corresponds to the Review entity
      type ProductReview implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        text: String!
        rating: Float!
      }
      
      extend type Query {
        # Now we can use this ProductReview type in queries
        # and mutations.
        reviewsForProduct(productId: ID!): [ProductReview!]!
      }
    `,
    resolvers: [ReviewsResolver]
  },
  entities: [ProductReview],  
})
export class ReviewsPlugin {}
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
  description(@Ctx() ctx: RequestContext, @Parent() product: Product) {
    return this.wrapInFormatting(ctx, product.id);
  }
  
  private wrapInFormatting(ctx: RequestContext, id: ID): string {
    // implementation omitted, but wraps the description
    // text in some special formatting required by the storefront
  }
}
```

## Resolving union results

When dealing with operations that return a GraphQL union type, there is an extra step needed.

Union types are commonly returned from mutations in the Vendure APIs. For more detail on this see the section on [ErrorResults]({{< relref "error-handling" >}}#expected-errors-errorresults). For example: 

```GraphQL
type MyCustomErrorResult implements ErrorResult {
  errorCode: ErrorCode!
  message: String!
}

union MyCustomMutationResult = Order | MyCustomErrorResult

extend type Mutation {
  myCustomMutation(orderId: ID!): MyCustomMutationResult!
}
```

In this example, the resolver which handles the `myCustomMutation` operation will be returning either an `Order` object or a `MyCustomErrorResult` object. The problem here is that the GraphQL server has no way of knowing which one it is at run-time. Luckily Apollo Server (on which Vendure is built) has a means to solve this:

> To fully resolve a union, Apollo Server needs to specify which of the union's types is being returned. To achieve this, you define a `__resolveType` function for the union in your resolver map.
> 
> The `__resolveType` function is responsible for determining an object's corresponding GraphQL type and returning the name of that type as a string.
> 
-- <cite>Source: [Apollo Server docs](https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/#resolving-a-union)</cite>

In order to implement a `__resolveType` function as part of your plugin, you need to create a dedicated Resolver class with a single field resolver method which will look like this:

```TypeScript
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, ProductVariant } from '@vendure/core';

@Resolver('MyCustomMutationResult')
export class MyCustomMutationResultResolver {
  
  @ResolveField()
  __resolveType(value: any): string {
    // If it has an "id" property we can assume it is an Order.  
    return value.hasOwnProperty('id') ? 'Order' : 'MyCustomErrorResult';
  }
}
```

This resolver is then passed in to your plugin metadata like any other resolver:

```TypeScript
@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: gql` ... `,
    resolvers: [/* ... */, MyCustomMutationResultResolver]
  }
})
export class MyPlugin {}
```

## Defining custom scalars

By default, Vendure bundles `DateTime` and a `JSON` custom scalars (from the [graphql-scalars library](https://github.com/Urigo/graphql-scalars)). From v1.7.0, you can also define your own custom scalars for use in your schema extensions:

```TypeScript
import { GraphQLScalarType} from 'graphql';
import { GraphQLEmailAddress } from 'graphql-scalars';

// Scalars can be custom-built as like this one,
// or imported from a pre-made scalar library like
// the GraphQLEmailAddress example.
const FooScalar = new GraphQLScalarType({
  name: 'Foo',
  description: 'A test scalar',
  serialize(value) {
    // ...
  },
  parseValue(value) {
    // ...
  },
});

@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: gql`
      scalar Foo
      scalar EmailAddress
    `,
    scalars: { 
      // The key must match the scalar name
      // given in the schema  
      Foo: FooScalar,
      EmailAddress: GraphQLEmailAddress,
    },
  },
})
export class CustomScalarsPlugin {}
```
