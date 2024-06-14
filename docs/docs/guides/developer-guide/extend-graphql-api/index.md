---
title: "Extend the GraphQL API"
showtoc: true
---

Extension to the GraphQL API consists of two parts:

1. **Schema extensions**. These define new types, fields, queries and mutations.
2. **Resolvers**. These provide the logic that backs up the schema extensions.

The Shop API and Admin APIs can be extended independently:

```ts title="src/plugins/top-products/top-products.plugin.ts"
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import gql from 'graphql-tag';
import { TopSellersResolver } from './api/top-products.resolver';

const schemaExtension = gql`
  extend type Query {
    topProducts: [Product!]!
  }
`

@VendurePlugin({
    imports: [PluginCommonModule],
    // highlight-start
    // We pass our schema extension and any related resolvers
    // to our plugin metadata  
    shopApiExtensions: {
        schema: schemaExtension,
        resolvers: [TopProductsResolver],
    },
    // Likewise, if you want to extend the Admin API,
    // you would use `adminApiExtensions` in exactly the
    // same way.  
    // adminApiExtensions: {
    //     schema: someSchemaExtension
    //     resolvers: [SomeResolver],
    // },
    // highlight-end
})
export class TopProductsPlugin {
}
```

There are a number of ways the GraphQL APIs can be modified by a plugin.

## Adding a new Query

Let's take a simple example where we want to be able to display a banner in our storefront.

First let's define a new query in the schema:

```ts title="src/plugins/banner/api/api-extensions.ts"
import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  extend type Query {
    // highlight-next-line
    activeBanner(locationId: String!): String
  }
`;
```

This defines a new query called `activeBanner` which takes a `locationId` string argument and returns a string. 

:::tip
`!` = non-nullable

In GraphQL, the `!` in `locationId: String!` indicates that the argument is required, and the lack of a `!` on the return type indicates that the return value can be `null`.
:::

We can now define the resolver for this query:

```ts title="src/plugins/banner/api/banner-shop.resolver.ts"
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core';
import { BannerService } from '../services/banner.service.ts';

@Resolver()
class BannerShopResolver {
    constructor(private bannerService: BannerService) {}

    // highlight-start
    @Query()
    activeBanner(@Ctx() ctx: RequestContext, @Args() args: { locationId: string; }) {
        return this.bannerService.getBanner(ctx, args.locationId);
    }
    // highlight-end
}
```

The `BannerService` would implement the actual logic for fetching the banner text from the database.

Finally, we need to add the resolver to the plugin metadata:

```ts title="src/plugins/banner/banner.plugin.ts"
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { BannerService } from './services/banner.service';
import { BannerShopResolver } from './api/banner-shop.resolver';
import { shopApiExtensions } from './api/api-extensions';

@VendurePlugin({
    imports: [PluginCommonModule],
    // highlight-start
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [BannerShopResolver],
    },
    // highlight-end
    providers: [BannerService],
})
export class BannerPlugin {}
```

## Adding a new Mutation

Let's continue the `BannerPlugin` example and now add a mutation which allows the administrator to set the banner text.

First we define the mutation in the schema:

```ts title="src/plugins/banner/api/api-extensions.ts"
import gql from 'graphql-tag';

export const adminApiExtensions = gql`
  extend type Mutation {
    // highlight-next-line
    setBannerText(locationId: String!, text: String!): String!
  }
`;
```

Here we are defining a new mutation called `setBannerText` which takes two arguments, `locationId` and `text`, both of which are required strings. The return type is a non-nullable string.

Now let's define a resolver to handle that mutation:

```ts title="src/plugins/banner/api/banner-admin.resolver.ts"
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, RequestContext, Permission, Transaction } from '@vendure/core';
import { BannerService } from '../services/banner.service.ts';

@Resolver()
class BannerAdminResolver {
    constructor(private bannerService: BannerService) {}

    // highlight-start
    @Allow(Permission.UpdateSettings)
    @Transaction()
    @Mutation()
    setBannerText(@Ctx() ctx: RequestContext, @Args() args: { locationId: string; text: string; }) {
        return this.bannerService.setBannerText(ctx, args.locationId, args.text);
    }
    // highlight-end
}
```

Note that we have used the `@Allow()` decorator to ensure that only users with the `UpdateSettings` permission can call this mutation. We have also wrapped the resolver in a transaction using `@Transaction()`, which is a good idea for any mutation which modifies the database.

:::info
For more information on the available decorators, see the [API Layer "decorators" guide](/guides/developer-guide/the-api-layer/#api-decorators).
:::

Finally, we add the resolver to the plugin metadata:

```ts title="src/plugins/banner/banner.plugin.ts"
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { BannerService } from './services/banner.service';
import { BannerShopResolver } from './api/banner-shop.resolver';
import { BannerAdminResolver } from './api/banner-admin.resolver';
import { shopApiExtensions, adminApiExtensions } from './api/api-extensions';

@VendurePlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        schema: shopApiExtensions,
        resolvers: [BannerShopResolver],
    },
    // highlight-start
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [BannerAdminResolver],
    },
    // highlight-end
    providers: [BannerService],
})
export class BannerPlugin {}
```


## Defining a new type

If you have defined a new database entity, it is likely that you'll want to expose this entity in your GraphQL API. To do so, you'll need to define a corresponding GraphQL type.

Using the `ProductReview` entity from the [Define a database entity guide](/guides/developer-guide/database-entity), let's see how we can expose it as a new type in the API.

As a reminder, here is the `ProductReview` entity:

```ts title="src/plugins/reviews/product-review.entity.ts"
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity, Product, EntityId, ID } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
class ProductReview extends VendureEntity {
    constructor(input?: DeepPartial<ProductReview>) {
        super(input);
    }

    @ManyToOne(type => Product)
    product: Product;
    
    @EntityId()
    productId: ID;

    @Column()
    text: string;

    @Column()
    rating: number;
}
```
Let's define a new GraphQL type which corresponds to this entity:

```ts title="src/plugins/reviews/api/api-extensions.ts"
import gql from 'graphql-tag';

export const apiExtensions = gql`
  // highlight-start
  type ProductReview implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    product: Product!
    productId: ID!
    text: String!
    rating: Float!
  }
  // highlight-end
`;
```

:::info
Assuming the entity is a standard `VendureEntity`, it is good practice to always include the `id`, `createdAt` and `updatedAt` fields in the GraphQL type.

Additionally, we implement `Node` which is a built-in GraphQL interface.
:::

Now we can add this type to both the Admin and Shop APIs:

```ts title="src/plugins/reviews/reviews.plugin.ts"
import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ReviewsResolver } from './api/reviews.resolver';
import { apiExtensions } from './api/api-extensions';
import { ProductReview } from './entities/product-review.entity';

@VendurePlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        // highlight-next-line
        schema: apiExtensions,
    },
    entities: [ProductReview],
})
export class ReviewsPlugin {}
```

## Add fields to existing types

Let's say you want to add a new field to the `ProductVariant` type to allow the storefront to display some indication of how long a particular product variant would take to deliver, based on data from some external service. 

First we extend the `ProductVariant` GraphQL type:

```ts title="src/plugins/delivery-time/api/api-extensions.ts"
import gql from 'graphql-tag';

export const shopApiExtensions = gql`
  type DeliveryEstimate {
    from: Int!
    to: Int!
  }

  // highlight-start
  extend type ProductVariant {
    delivery: DeliveryEstimate!
  }
  // highlight-end
}`;
```

This schema extension says that the `delivery` field will be added to the `ProductVariant` type, and that it will be of type `DeliveryEstimate!`, i.e. a non-nullable
instance of the `DeliveryEstimate` type.

Next we need to define an "entity resolver" for this field. Unlike the resolvers we have seen above, this resolver will be handling fields on the `ProductVariant` type _only_. This is done by scoping the resolver class that type by passing the type name to the `@Resolver()` decorator:

```ts title="src/plugins/delivery-time/product-variant-entity.resolver.ts"
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, ProductVariant } from '@vendure/core';
import { DeliveryEstimateService } from '../services/delivery-estimate.service';

// highlight-next-line
@Resolver('ProductVariant')
export class ProductVariantEntityResolver {
    constructor(private deliveryEstimateService: DeliveryEstimateService) { }

    // highlight-start
    @ResolveField()
    delivery(@Ctx() ctx: RequestContext, @Parent() variant: ProductVariant) {
        return this.deliveryEstimateService.getEstimate(ctx, variant.id);
    }
    // highlight-end
}
```

Finally we need to pass these schema extensions and the resolver to our plugin metadata:

```ts title="src/plugins/delivery-time/delivery-time.plugin.ts"
import gql from 'graphql-tag';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductVariantEntityResolver } from './api/product-variant-entity.resolver';
import { shopApiExtensions } from './api/api-extensions';

@VendurePlugin({
    imports: [PluginCommonModule],
    shopApiExtensions: {
        // highlight-start
        schema: shopApiExtensions,
        resolvers: [ProductVariantEntityResolver]
        // highlight-end
    }
})
export class DeliveryTimePlugin {}
```

## Override built-in resolvers

It is also possible to override an existing built-in resolver function with one of your own. To do so, you need to define a resolver with the same name as the query or mutation you wish to override. When that query or mutation is then executed, your code, rather than the default Vendure resolver, will handle it.

```ts
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

```ts
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

Union types are commonly returned from mutations in the Vendure APIs. For more detail on this see the section on [ErrorResults](/guides/developer-guide/error-handling#expected-errors-errorresults). For example: 

```graphql
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

```ts
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

```ts
@VendurePlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    schema: apiExtensions,
    resolvers: [/* ... */, MyCustomMutationResultResolver]
  }
})
export class MyPlugin {}
```

## Defining custom scalars

By default, Vendure bundles `DateTime` and a `JSON` custom scalars (from the [graphql-scalars library](https://github.com/Urigo/graphql-scalars)). From v1.7.0, you can also define your own custom scalars for use in your schema extensions:

```ts
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
