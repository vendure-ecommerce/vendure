---
title: "Transaction Decorator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Transaction

<GenerationInfo sourceFile="packages/core/src/api/decorators/transaction.decorator.ts" sourceLine="81" packageName="@vendure/core" />

Runs the decorated method in a TypeORM transaction. It works by creating a transactional
QueryRunner which gets attached to the RequestContext object. When the RequestContext
is the passed to the <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> `getRepository()` method, this
QueryRunner is used to execute the queries within this transaction.

Essentially, the entire resolver function is wrapped in a try-catch block which commits the
transaction on successful completion of the method, or rolls back the transaction in an unhandled
error is thrown.

*Example*

```ts
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



## TransactionMode

<GenerationInfo sourceFile="packages/core/src/api/decorators/transaction.decorator.ts" sourceLine="32" packageName="@vendure/core" />

The Transaction decorator can handle transactions automatically (which is the default) or be set to
"manual" mode, where the <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> `.startTransaction()` and `.commitOpenTransaction()`
methods must them be used.

*Example*

```ts
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

```ts title="Signature"
type TransactionMode = 'auto' | 'manual'
```


## TransactionIsolationLevel

<GenerationInfo sourceFile="packages/core/src/api/decorators/transaction.decorator.ts" sourceLine="45" packageName="@vendure/core" />

Transactions can be run at different isolation levels. The default is undefined, which
falls back to the default of your database. See the documentation of your database for more
information on available isolation levels.

```ts title="Signature"
type TransactionIsolationLevel = | 'READ UNCOMMITTED'
    | 'READ COMMITTED'
    | 'REPEATABLE READ'
    | 'SERIALIZABLE'
```
