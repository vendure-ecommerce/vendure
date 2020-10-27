---
title: "Extending the GraphQL API"
showtoc: true
---

# Extending the GraphQL API

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

@Injectable()
class TopSellersService { 
  getTopSellers() { /* ... */ }
}
```

```TypeScript
// top-sellers.plugin.ts
import gql from 'graphql-tag';
import { VendurePlugin } from '@vendure/core';
import { TopSellersService } from './top-sellers.service'
import { TopSellersResolver } from './top-sellers.resolver'

@VendurePlugin({
  providers: [TopSellersService],
  adminApiExtensions: {
    schema: gql`
      extend type Query {
        topSellers(from: DateTime! to: DateTime!): [Product!]!
      }
    `,
    resolvers: [TopSellersResolver]
  }
})
export class TopSellersPlugin {}
```

Using the `gql` tag, it is possible to:

* add new queries `extend type Query { ... }`
* add new mutations (`extend type Mutation { ... }`)
* define brand new types `type MyNewType { ... }`
* add new fields to built-in types (`extend type Product { newField: String }`)
