---
title: "Announcing Vendure v0.16.0"
date: 2020-10-09T08:00:00
draft: false
author: "Michael Bromley"
images: 
    - "/blog/2020/10/announcing-vendure-v0.16.0/vendure-0.16.0-banner-01.jpg"
---

We are excited to announce the release of Vendure v0.16.0! This release introduces some major changes aimed at helping you build rock-solid, fault-tolerant e-commerce applications.

<!--more-->

{{< vimeo id="466533611" >}}

## Transactions

Transactions are a database feature which enable [atomic operations](https://en.wikipedia.org/wiki/Atomicity_(database_systems)) which means that a series of database operations are guaranteed to either all succeed, or all fail, with no partial (in-between) states allowed. Transactions ensure that if _one_ of the operations fail, then the entire set of changes is "rolled back" (reversed) making it as if no changes were made at all.

### Example

Let's take a look at a simplified example from the Vendure core:

```TypeScript
export class AdministratorService {

  async create(ctx: RequestContext, input: CreateAdministratorInput): Promise<Administrator> {
    const administrator = new Administrator(input);
    
    // Create and save a new User entity
    administrator.user = await this.userService
      .createAdminUser(ctx, input.emailAddress, input.password);

    // Save the new Administrator entity
    let createdAdministrator = await this.connection
      .getRepository(ctx, Administrator)
      .save(administrator);

    return createdAdministrator;
  }

}
```

In this `create()` method, we are creating a new Administrator in 2 steps: create a User (which stores the credentials) and then an Administrator (which stores the name etc.).

Imagine if there was some kind of error in saving the Administrator. This would result in a User being created, but there would be no corresponding Administrator entity. Such scenarios result in an inconsistent state in the database and can lead to all manner of hard-to-find bugs. This is a very simple example for illustration - the problems can be much more severe when dealing with the manipulation of order and stock data. Inconsistencies there can lead to invalid financial and inventory reporting.

The solution then is to wrap the entire `create()` method in a transaction. The transaction will ensure that if there is an error in saving the Administrator (or anywhere else), then the entire set of operations will be rolled back, returning the database to the state it was in before the User entity was created.

### Transactions in Vendure 0.16.0

**Vendure v0.16.0 now uses transactions for _all mutations_**. This is achieved via two new features:

* A new [`@Transaction()`]({{< relref "transaction-decorator" >}}) decorator
* A new [`TransactionalConnection`]({{< relref "transactional-connection" >}}) provider

To wrap a mutation in a transaction, we apply first the Transaction decorator to the resolver:

```TypeScript {hl_lines=[1]}
@Transaction()
@Mutation()
@Allow(Permission.CreateAdministrator)
createAdministrator(@Ctx() ctx: RequestContext, @Args() args: MutationCreateAdministratorArgs): Promise<Administrator> {
  const { input } = args;
  return this.administratorService.create(ctx, input);
}
```

We then make sure to use the TransactionalConnection whenever we need to interact with the database. This new provider is a wrapper around the TypeORM Connection object, which works together with the Transaction decorator to ensure that any database operations can be rolled back in the event of an error.

```TypeScript {hl_lines=[3,11]}
export class AdministratorService {
  constructor(
    private connection: TransactionalConnection,
    private configService: ConfigService,
    // ... etc
  ) {}

  async create(ctx: RequestContext, input: CreateAdministratorInput): Promise<Administrator> {
    // ...
    let createdAdministrator = await this.connection
      .getRepository(ctx, Administrator)
      .save(administrator);
    
    return createdAdministrator;
  }
}
```

If you have created your own Vendure plugins which use the TypeORM Connection object to access the database, you'll want to update your code as part of migrating to 0.16.0 to use the TransactionalConnection instead. See the migration guide toward the end of this post for details.

Transaction support has been planned for a long time, and is a _major_ step towards reaching our first stable, production-ready release! You can read more about the implementation and evolution of the feature in the GitHub issue [Make use of TypeORM transactions](https://github.com/vendure-ecommerce/vendure/issues/242).

## Improved GraphQL error handling

One of the major benefits of GraphQL APIs is the static schema, which allows us _and_ our developer tools to know exactly what operations and types exist on the API. However, in a typical GraphQL API this all breaks down when it comes to error handling. The typical way that errors are handled is that an error is thrown somewhere in the resolver, and this is then returned in the `errors` array of the response, as described in the [Apollo Server error handling guide](https://www.apollographql.com/docs/apollo-server/data/errors/).

```JSON
{
  "data": null,
  "errors": [{
    "message": "Something went horribly wrong",
    "path": ["myMutation"],
    "extensions": { 
      // ...
    }
  }]
}
```

### The Problem

This approach has some issues, however:

1. There is no way to know what errors can be returned from a particular operation.
2. Errors cannot be statically typed in client code using code generation tools.
3. Certain mutations which operate on multiple inputs cannot easily model the outcome that "2 succeeded (with results) but 1 failed (with error)"

As an example take the `addItemToOrder` mutation. Normally this will add an item to the Order and return the Order. However, if we try to add ten thousand items, it will result in an error because there is a limit to the maximum size of an Order:

{{% tab "Request" %}}
```GraphQL
mutation {
  addItemToOrder(productVariantId: 1, quantity: 10000) {
    id
    total
  }
}
```
{{% /tab %}}
{{% tab "Response" %}}
```JSON
{
  "errors": [
    {
      "message": "Cannot add items. An order may consist of a maximum of 999 items",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "addItemToOrder"
      ],
      "extensions": {
        "code": "ORDER_ITEMS_LIMIT_EXCEEDED"
      }
    }
  ],
  "data": {
    "addItemToOrder": null
  }
}
```
{{% /tab %}}

The developer, in building a storefront app has no easy way to know about this possible outcome without extremely careful study of all documentation and in some cases the Vendure source code. So the developer is left having to implement some generic error handling code and hoping for the best.

**Vendure has a primary goal of first-class developer experience. This situation was not acceptable!** 

### The solution

In searching for a better way to handle errors, we came across the presentation [200 OK! Error Handling in GraphQL](https://www.youtube.com/watch?v=RDNTP66oY2o) by Sasha Solomon. We then further explored the ideas from this talk in the issue [Improved error handling in GraphQL APIs](https://github.com/vendure-ecommerce/vendure/issues/437).

The solution is that mutations which have well-defined error results now encode these as part of the GraphQL schema. Returning to the `addItemToOrder` example, the schema now looks like this:

```GraphQL
type Mutation {
    addItemToOrder(productVariantId: ID!, quantity: Int!): UpdateOrderItemsResult!
}

"Retured when the maximum order size limit has been reached."
type OrderLimitError implements ErrorResult {
    errorCode: ErrorCode!
    message: String!
    maxItems: Int!
}

union UpdateOrderItemsResult = Order | OrderLimitError
```

So immediately we know that, whenever we add items to an Order, there is the possibility of receiving a `OrderLimitError` result. In our storefront we can now handle this accordingly:

{{% tab "Request" %}}
```GraphQL
mutation {
  addItemToOrder(productVariantId: 1, quantity: 1) {
    ... on Order {
      id
      code
      total
    }
    ... on OrderLimitError {
      errorCode
      message
      maxItems
    }
  }
}
```
{{% /tab %}}
{{% tab "Success response" %}}
```JSON
{
  "data": {
    "addItemToOrder": {
      "id": "1",
      "code": "8DLXWUKMUNHTWF39",
      "total": 155880
    }
  }
}
```
{{% /tab %}}
{{% tab "Error response" %}}
```JSON
{
  "data": {
    "addItemToOrder": {
      "errorCode": "ORDER_LIMIT_ERROR",
      "message": "Cannot add items. An order may consist of a maximum of 999 items",
      "maxItems": 999
    }
  }
}
```
{{% /tab %}}

{{< alert warning >}}
These changes to most of the mutations in the Shop API will mean _you will need to update your storefront_. See the migration guide below for details.
{{< /alert >}}

**📖 Read more in the new [Error handling guide]({{< relref "error-handling" >}}).**

This pattern of error handling is novel but has been well-explored by forward-thinking developers and we believe it will increasingly become a mark of a well-design GraphQL API.

Further reading:

* [Where art thou, my error?](https://artsy.github.io/blog/2018/10/19/where-art-thou-my-error/) Eloy Durán, 2018
* [Handling GraphQL errors like a champ with unions and interfaces](https://blog.logrocket.com/handling-graphql-errors-like-a-champ-with-unions-and-interfaces/) Laurin Quast, 2019
* [200 OK! Error Handling in GraphQL](https://medium.com/@sachee/200-ok-error-handling-in-graphql-7ec869aec9bc) Sasha Solomon, 2019

## Fulfillment states

Fulfillments represent the shipping of goods to a Customer. Previously, as soon as a Fulfillment was created, the Order would be marked as "Fulfilled". However, this does not accurately capture the various stages that a fulfillment goes through. In reality a Fulfillment would be typically created and then shipped. A few days later it would be delivered to the customer. At that point the Order can be considered "Fulfilled".

Thanks to the hard work of community member [Jonathan Célio](https://github.com/jonyw4) we can now accurately model the state of a Fulfillment.

{{< figure src="./fulfillment-state.gif" >}}

In fact, Fulfillments are now based on a finite state machine, and just as with Orders, their states can be customized using the new [`ShippingOptions.customFulfillmentProcess`]({{< relref "shipping-options" >}}#customfulfillmentprocess) option in the VendureConfig.

**📖 Read more in the new [Fulfillments guide]({{< relref "/docs/developer-guide/shipping" >}}#fulfillments).**

## Other notable improvements

* The Customer entity is now channel-aware, meaning that Customers are associated with any [Channels]({{< relref "channels" >}}) with which they have interacted. This is part of a community effort lead by [Hendrik Depauw](https://github.com/hendrikdepauw) to make Vendure suitable for multi-tenant marketplace-type applications.
* Metadata on Payments is now private by default (i.e. not available via the Shop API), but [specific data _can_ be made public as needed]({{< relref "payment-method-types" >}}#metadata).
* All core technologies on which Vendure is built have been upgraded to their latest versions, including:
  * NestJS v7.4
  * TypeORM v0.2.28
  * GraphQL v15.3
  * Angular v10.1

**📖 See all changes in the [v0.16.0 Changelog](https://github.com/vendure-ecommerce/vendure/blob/f081d63a09f2fbc36c293e8464d4c92bab664ca6/CHANGELOG.md#0160-2020-10-09)**

## BREAKING CHANGES / Migration Guide

{{< alert warning >}}
**🚧 Read this section carefully**
{{< /alert >}}

Due to the new features described above, there are some **major breaking changes** which you'll need to account for when updating to v0.16.0. In fact, this release introduces more breaks than any previous release. We hope you can appreciate that the day or so of work to upgrade will be well worth the long-term benefits of getting these core pieces right, before we reach v1.0.

👉 For general instructions on upgrading, please see the new [Updating Vendure guide]({{< relref "updating-vendure" >}}).

### Database migration

1. Generate a migration script as described in the [Migrations guide]({{< relref "migrations" >}}).
2. Now that Customers are associated with Channels, you'll need to manually add the following query to your migration at the end:
   ```TypeScript
   // Assuming the ID of the default Channel is 1.
   // If you are using a UUID strategy, replace 1 with 
   // the ID of the default channel.
    await queryRunner.query(
      'INSERT INTO `customer_channels_channel` (customerId, channelId) SELECT id, 1 FROM `customer`',
      undefined,
    );
   ```
   
   or if using Postgres:
    ```TypeScript
     await queryRunner.query(
       'INSERT INTO "customer_channels_channel" ("customerId", "channelId") SELECT id, 1 FROM "customer"',
       undefined,
     );
    ```
   
3. **IMPORTANT** test the migration first on data you are prepared to lose to ensure that it works as expected. Do not run on production data without testing.

### Update mutations to handle new ErrorResult

Your storefront will need to be updated to correctly select the results of mutations which now return union types as described above in the [Improved GraphQL error handling](#improved-graphql-error-handling) section.

```diff
mutation {
  addItemToOrder(productVariantId: 1, quantity: 1) {
-    id
-    code
-    total
+    ... on Order {
+      id
+      code
+      total
+    }
+    ... on ErrorResult {
+      errorCode
+      message
+    }
  }
}
```

The mutations in the Shop API which have changed are:

* [addItemToOrder]({{< relref "/docs/graphql-api/shop/mutations" >}}#additemtoorder)
* [removeOrderLine]({{< relref "/docs/graphql-api/shop/mutations" >}}#removeorderline)
* [removeAllOrderLines]({{< relref "/docs/graphql-api/shop/mutations" >}}#removeallorderlines)
* [adjustOrderLine]({{< relref "/docs/graphql-api/shop/mutations" >}}#adjustorderline)
* [applyCouponCode]({{< relref "/docs/graphql-api/shop/mutations" >}}#applycouponcode)
* [transitionOrderToState]({{< relref "/docs/graphql-api/shop/mutations" >}}#transitionordertostate)
* [setOrderShippingMethod]({{< relref "/docs/graphql-api/shop/mutations" >}}#setordershippingmethod)
* [addPaymentToOrder]({{< relref "/docs/graphql-api/shop/mutations" >}}#addpaymenttoorder)
* [setCustomerForOrder]({{< relref "/docs/graphql-api/shop/mutations" >}}#setcustomerfororder)
* [login]({{< relref "/docs/graphql-api/shop/mutations" >}}#login)
* [authenticate]({{< relref "/docs/graphql-api/shop/mutations" >}}#authenticate)
* [logout]({{< relref "/docs/graphql-api/shop/mutations" >}}#logout)
* [registerCustomerAccount]({{< relref "/docs/graphql-api/shop/mutations" >}}#registercustomeraccount)
* [refreshCustomerVerification]({{< relref "/docs/graphql-api/shop/mutations" >}}#refreshcustomerverification)
* [deleteCustomerAddress]({{< relref "/docs/graphql-api/shop/mutations" >}}#deletecustomeraddress)
* [verifyCustomerAccount]({{< relref "/docs/graphql-api/shop/mutations" >}}#verifycustomeraccount)
* [updateCustomerPassword]({{< relref "/docs/graphql-api/shop/mutations" >}}#updatecustomerpassword)
* [requestUpdateCustomerEmailAddress]({{< relref "/docs/graphql-api/shop/mutations" >}}#requestupdatecustomeremailaddress)
* [updateCustomerEmailAddress]({{< relref "/docs/graphql-api/shop/mutations" >}}#updatecustomeremailaddress)
* [requestPasswordReset]({{< relref "/docs/graphql-api/shop/mutations" >}}#requestpasswordreset)
* [resetPassword]({{< relref "/docs/graphql-api/shop/mutations" >}}#resetpassword)

If your project includes e2e tests, you will also need to update any GraphQL operations that deal with updated mutations. 

### Update custom plugins to use TransactionalConnection

If you have custom plugin code which interacts with the database, you should remove all references to the TypeORM Connection object and replace it with the new TransactionalConnection.

```diff
import { Injectable } from '@nestjs/common';
-import { Connection } from 'typeorm';
-import { InjectConnection } from '@nestjs/typeorm';
+import { TransactionalConnection } from '@vendure/core';


@Injectable()
export class MyService {

  constructor(
-   @InjectConnection() private connection: Connection,
+   private connection: TransactionalConnection,
  ) {}
}
```

Additionally, you should always pass the RequestContext through to database operations.

```diff
@Injectable()
export class MyService {
  
  // ...
  
  async create(ctx: RequestContext, name: string) {
    const newThing = new Thing({ name });
-   return this.connection.getRepository(Thing).save(newThing);
+   return this.connection.getRepository(ctx, Thing).save(newThing);
  }

}
```

If you are using the helper functions `getEntityOrThrow` or `findOneInChannel`, they have been deprecated and replaced by an equivalent methods on the TransactionalConnection object:

```diff
- const order = await getEntityOrThrow(this.connection, Order, orderId);
+ const order = await this.connection.getEntityOrThrow(ctx, Order, orderId);
``` 

### Update to new Vendure Service APIs

In order to support transactions, many internal Service methods have changed their signatures to now take a `RequestContext` argument. If your plugin code is using any of these services, you'll need to update those method calls - TypeScript will tell you of any errors.

```diff
const customer = await this.customerService
- .findOneByUserId(ctx.activeUserId);
+ .findOneByUserId(ctx, ctx.activeUserId);
```

### `generateOrderCode` replaced

If you use a custom `generateOrderCode` function, this option has now been replaced with the new [`OrderCodeStrategy`]({{< relref "order-code-strategy" >}}), which brings the setting into line with other strategy-pattern APIs and allows the injection of providers into the order code logic.

### Payment.metadata now private

The `Payement.metadata` field is now private by default. If your custom PaymentMethodHandler implementation depends on having this metadata available to the storefront via the Shop API, you'll need to now place any public data in the special `public` property of the metadata:

```diff
createPayment: async (order, args, metadata): Promise<CreatePaymentResult> => {
  // ...
  return {
    amount: order.total,
    state: 'Authorized' as const,
    transactionId: result.id.toString(),
    metadata: {
-     gatewayUrl: result.url,
+     public: {
+       gatewayUrl: result.url,
+     }
    },
  };
}
```
