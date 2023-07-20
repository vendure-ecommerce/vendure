---
title: "TransactionalConnection"
weight: 10
date: 2023-07-14T16:57:49.786Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TransactionalConnection
<div class="symbol">


# TransactionalConnection

{{< generation-info sourceFile="packages/core/src/connection/transactional-connection.ts" sourceLine="38" packageName="@vendure/core">}}

The TransactionalConnection is a wrapper around the TypeORM `Connection` object which works in conjunction
with the <a href='/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator to implement per-request transactions. All services which access the
database should use this class rather than the raw TypeORM connection, to ensure that db changes can be
easily wrapped in transactions when required.

The service layer does not need to know about the scope of a transaction, as this is covered at the
API by the use of the `Transaction` decorator.

## Signature

```TypeScript
class TransactionalConnection {
  constructor(connection: Connection, transactionWrapper: TransactionWrapper)
  rawConnection: Connection
  getRepository(target: ObjectType<Entity> | EntitySchema<Entity> | string) => Repository<Entity>;
  getRepository(ctx: RequestContext | undefined, target: ObjectType<Entity> | EntitySchema<Entity> | string) => Repository<Entity>;
  getRepository(ctxOrTarget: RequestContext | ObjectType<Entity> | EntitySchema<Entity> | string | undefined, maybeTarget?: ObjectType<Entity> | EntitySchema<Entity> | string) => Repository<Entity>;
  async withTransaction(work: (ctx: RequestContext) => Promise<T>) => Promise<T>;
  async withTransaction(ctx: RequestContext, work: (ctx: RequestContext) => Promise<T>) => Promise<T>;
  async withTransaction(ctxOrWork: RequestContext | ((ctx: RequestContext) => Promise<T>), maybeWork?: (ctx: RequestContext) => Promise<T>) => Promise<T>;
  async startTransaction(ctx: RequestContext, isolationLevel?: TransactionIsolationLevel) => ;
  async commitOpenTransaction(ctx: RequestContext) => ;
  async rollBackTransaction(ctx: RequestContext) => ;
  async getEntityOrThrow(ctx: RequestContext, entityType: Type<T>, id: ID, options: GetEntityOrThrowOptions<T> = {}) => Promise<T>;
  findOneInChannel(ctx: RequestContext, entity: Type<T>, id: ID, channelId: ID, options: FindOneOptions<T> = {}) => ;
  findByIdsInChannel(ctx: RequestContext, entity: Type<T>, ids: ID[], channelId: ID, options: FindManyOptions<T>) => ;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: Connection, transactionWrapper: TransactionWrapper) => TransactionalConnection"  >}}

{{< member-description >}}{{< /member-description >}}

### rawConnection

{{< member-info kind="property" type="Connection"  >}}

{{< member-description >}}The plain TypeORM Connection object. Should be used carefully as any operations
performed with this connection will not be performed within any outer
transactions.{{< /member-description >}}

### getRepository

{{< member-info kind="method" type="(target: ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string) => Repository&#60;Entity&#62;"  >}}

{{< member-description >}}Returns a TypeORM repository. Note that when no RequestContext is supplied, the repository will not
be aware of any existing transaction. Therefore, calling this method without supplying a RequestContext
is discouraged without a deliberate reason.{{< /member-description >}}

### getRepository

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> | undefined, target: ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string) => Repository&#60;Entity&#62;"  >}}

{{< member-description >}}Returns a TypeORM repository which is bound to any existing transactions. It is recommended to _always_ pass
the RequestContext argument when possible, otherwise the queries will be executed outside of any
ongoing transactions which have been started by the <a href='/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator.{{< /member-description >}}

### getRepository

{{< member-info kind="method" type="(ctxOrTarget: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> | ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string | undefined, maybeTarget?: ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string) => Repository&#60;Entity&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### withTransaction

{{< member-info kind="method" type="(work: (ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;) => Promise&#60;T&#62;"  since="1.3.0" >}}

{{< member-description >}}Allows database operations to be wrapped in a transaction, ensuring that in the event of an error being
thrown at any point, the entire transaction will be rolled back and no changes will be saved.

In the context of API requests, you should instead use the <a href='/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator on your resolver or
controller method.

On the other hand, for code that does not run in the context of a GraphQL/REST request, this method
should be used to protect against non-atomic changes to the data which could leave your data in an
inconsistent state.

Such situations include function processed by the JobQueue or stand-alone scripts which make use
of Vendure internal services.

If there is already a <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> object available, you should pass it in as the first
argument in order to create transactional context as the copy. If not, omit the first argument and an empty
RequestContext object will be created, which is then used to propagate the transaction to
all inner method calls.

*Example*

```TypeScript
private async transferCredit(outerCtx: RequestContext, fromId: ID, toId: ID, amount: number) {
  await this.connection.withTransaction(outerCtx, async ctx => {
    // Note you must not use `outerCtx` here, instead use `ctx`. Otherwise, this query
    // will be executed outside of transaction
    await this.giftCardService.updateCustomerCredit(ctx, fromId, -amount);

    await this.connection.getRepository(ctx, GiftCard).update(fromId, { transferred: true })

    // If some intermediate logic here throws an Error,
    // then all DB transactions will be rolled back and neither Customer's
    // credit balance will have changed.

    await this.giftCardService.updateCustomerCredit(ctx, toId, amount);
  })
}
```{{< /member-description >}}

### withTransaction

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, work: (ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;) => Promise&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### withTransaction

{{< member-info kind="method" type="(ctxOrWork: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> | ((ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;), maybeWork?: (ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;) => Promise&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### startTransaction

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, isolationLevel?: <a href='/typescript-api/request/transaction-decorator#transactionisolationlevel'>TransactionIsolationLevel</a>) => "  >}}

{{< member-description >}}Manually start a transaction if one is not already in progress. This method should be used in
conjunction with the `'manual'` mode of the <a href='/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator.{{< /member-description >}}

### commitOpenTransaction

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "  >}}

{{< member-description >}}Manually commits any open transaction. Should be very rarely needed, since the <a href='/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator
and the internal TransactionInterceptor take care of this automatically. Use-cases include situations
in which the worker thread needs to access changes made in the current transaction, or when using the
Transaction decorator in manual mode.{{< /member-description >}}

### rollBackTransaction

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "  >}}

{{< member-description >}}Manually rolls back any open transaction. Should be very rarely needed, since the <a href='/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator
and the internal TransactionInterceptor take care of this automatically. Use-cases include when using the
Transaction decorator in manual mode.{{< /member-description >}}

### getEntityOrThrow

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entityType: Type&#60;T&#62;, id: <a href='/typescript-api/common/id#id'>ID</a>, options: <a href='/typescript-api/data-access/get-entity-or-throw-options#getentityorthrowoptions'>GetEntityOrThrowOptions</a>&#60;T&#62; = {}) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Finds an entity of the given type by ID, or throws an `EntityNotFoundError` if none
is found.{{< /member-description >}}

### findOneInChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: Type&#60;T&#62;, id: <a href='/typescript-api/common/id#id'>ID</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, options: FindOneOptions&#60;T&#62; = {}) => "  >}}

{{< member-description >}}Like the TypeOrm `Repository.findOne()` method, but limits the results to
the given Channel.{{< /member-description >}}

### findByIdsInChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: Type&#60;T&#62;, ids: <a href='/typescript-api/common/id#id'>ID</a>[], channelId: <a href='/typescript-api/common/id#id'>ID</a>, options: FindManyOptions&#60;T&#62;) => "  >}}

{{< member-description >}}Like the TypeOrm `Repository.findByIds()` method, but limits the results to
the given Channel.{{< /member-description >}}


</div>
