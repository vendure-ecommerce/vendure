---
title: "Transaction Decorator"
weight: 10
date: 2023-07-14T16:57:49.411Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Transaction Decorator
<div class="symbol">


# Transaction

{{< generation-info sourceFile="packages/core/src/api/decorators/transaction.decorator.ts" sourceLine="77" packageName="@vendure/core">}}

Runs the decorated method in a TypeORM transaction. It works by creating a transactional
QueryRunner which gets attached to the RequestContext object. When the RequestContext
is the passed to the <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> `getRepository()` method, this
QueryRunner is used to execute the queries within this transaction.

Essentially, the entire resolver function is wrapped in a try-catch block which commits the
transaction on successful completion of the method, or rolls back the transaction in an unhandled
error is thrown.

*Example*

```TypeScript
// in a GraphQL resolver file

@Transaction()
async myMutation(@Ctx() ctx: RequestContext) {
  // as long as the `ctx` object is passed in to
  // all database operations, the entire mutation
  // will be run as an atomic transaction, and rolled
  // back if an error is thrown.
  const result = this.myService.createThing(ctx);
  return this.myService.updateOtherThing(ctx, result.id);
}
```

</div>
<div class="symbol">


# TransactionMode

{{< generation-info sourceFile="packages/core/src/api/decorators/transaction.decorator.ts" sourceLine="32" packageName="@vendure/core">}}

The Transaction decorator can handle transactions automatically (which is the default) or be set to
"manual" mode, where the <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> `.startTransaction()` and `.commitOpenTransaction()`
methods must them be used.

*Example*

```TypeScript
// in a GraphQL resolver file

@Transaction('manual')
async myMutation(@Ctx() ctx: RequestContext) {
  await this.connection.startTransaction(ctx);
  const result = this.myService.createThing(ctx);
  const thing = this.myService.updateOtherThing(ctx, result.id);
  await this.connection.commitOpenTransaction(ctx);
  return thing;
}
```
Note that even in manual mode, a rollback will be automatically performed in
the case that an uncaught error is thrown within the resolver.

## Signature

```TypeScript
type TransactionMode = 'auto' | 'manual'
```
</div>
<div class="symbol">


# TransactionIsolationLevel

{{< generation-info sourceFile="packages/core/src/api/decorators/transaction.decorator.ts" sourceLine="45" packageName="@vendure/core">}}

Transactions can be run at different isolation levels. The default is undefined, which
falls back to the default of your database. See the documentation of your database for more
information on available isolation levels.

## Signature

```TypeScript
type TransactionIsolationLevel = 'READ UNCOMMITTED' | 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE'
```
</div>
