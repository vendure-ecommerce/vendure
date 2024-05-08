---
title: "TransactionalConnection"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TransactionalConnection

<GenerationInfo sourceFile="packages/core/src/connection/transactional-connection.ts" sourceLine="40" packageName="@vendure/core" />

The TransactionalConnection is a wrapper around the TypeORM `Connection` object which works in conjunction
with the <a href='/reference/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator to implement per-request transactions. All services which access the
database should use this class rather than the raw TypeORM connection, to ensure that db changes can be
easily wrapped in transactions when required.

The service layer does not need to know about the scope of a transaction, as this is covered at the
API by the use of the `Transaction` decorator.

```ts title="Signature"
class TransactionalConnection {
    constructor(dataSource: DataSource, transactionWrapper: TransactionWrapper)
    rawConnection: DataSource
    getRepository(target: ObjectType<Entity> | EntitySchema<Entity> | string) => Repository<Entity>;
    getRepository(ctx: RequestContext | undefined, target: ObjectType<Entity> | EntitySchema<Entity> | string) => Repository<Entity>;
    getRepository(ctxOrTarget: RequestContext | ObjectType<Entity> | EntitySchema<Entity> | string | undefined, maybeTarget?: ObjectType<Entity> | EntitySchema<Entity> | string) => Repository<Entity>;
    withTransaction(work: (ctx: RequestContext) => Promise<T>) => Promise<T>;
    withTransaction(ctx: RequestContext, work: (ctx: RequestContext) => Promise<T>) => Promise<T>;
    withTransaction(ctxOrWork: RequestContext | ((ctx: RequestContext) => Promise<T>), maybeWork?: (ctx: RequestContext) => Promise<T>) => Promise<T>;
    startTransaction(ctx: RequestContext, isolationLevel?: TransactionIsolationLevel) => ;
    commitOpenTransaction(ctx: RequestContext) => ;
    rollBackTransaction(ctx: RequestContext) => ;
    getEntityOrThrow(ctx: RequestContext, entityType: Type<T>, id: ID, options: GetEntityOrThrowOptions<T> = {}) => Promise<T>;
    findOneInChannel(ctx: RequestContext, entity: Type<T>, id: ID, channelId: ID, options: FindOneOptions<T> = {}) => ;
    findByIdsInChannel(ctx: RequestContext, entity: Type<T>, ids: ID[], channelId: ID, options: FindManyOptions<T>) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(dataSource: DataSource, transactionWrapper: TransactionWrapper) => TransactionalConnection`}   />


### rawConnection

<MemberInfo kind="property" type={`DataSource`}   />

The plain TypeORM Connection object. Should be used carefully as any operations
performed with this connection will not be performed within any outer
transactions.
### getRepository

<MemberInfo kind="method" type={`(target: ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string) => Repository&#60;Entity&#62;`}   />

Returns a TypeORM repository. Note that when no RequestContext is supplied, the repository will not
be aware of any existing transaction. Therefore, calling this method without supplying a RequestContext
is discouraged without a deliberate reason.
### getRepository

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | undefined, target: ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string) => Repository&#60;Entity&#62;`}   />

Returns a TypeORM repository which is bound to any existing transactions. It is recommended to _always_ pass
the RequestContext argument when possible, otherwise the queries will be executed outside of any
ongoing transactions which have been started by the <a href='/reference/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator.
### getRepository

<MemberInfo kind="method" type={`(ctxOrTarget: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string | undefined, maybeTarget?: ObjectType&#60;Entity&#62; | EntitySchema&#60;Entity&#62; | string) => Repository&#60;Entity&#62;`}   />


### withTransaction

<MemberInfo kind="method" type={`(work: (ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;) => Promise&#60;T&#62;`}  since="1.3.0"  />

Allows database operations to be wrapped in a transaction, ensuring that in the event of an error being
thrown at any point, the entire transaction will be rolled back and no changes will be saved.

In the context of API requests, you should instead use the <a href='/reference/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator on your resolver or
controller method.

On the other hand, for code that does not run in the context of a GraphQL/REST request, this method
should be used to protect against non-atomic changes to the data which could leave your data in an
inconsistent state.

Such situations include function processed by the JobQueue or stand-alone scripts which make use
of Vendure internal services.

If there is already a <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> object available, you should pass it in as the first
argument in order to create transactional context as the copy. If not, omit the first argument and an empty
RequestContext object will be created, which is then used to propagate the transaction to
all inner method calls.

*Example*

```ts
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
```
### withTransaction

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, work: (ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;) => Promise&#60;T&#62;`}   />


### withTransaction

<MemberInfo kind="method" type={`(ctxOrWork: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | ((ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;), maybeWork?: (ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) =&#62; Promise&#60;T&#62;) => Promise&#60;T&#62;`}   />


### startTransaction

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, isolationLevel?: <a href='/reference/typescript-api/request/transaction-decorator#transactionisolationlevel'>TransactionIsolationLevel</a>) => `}   />

Manually start a transaction if one is not already in progress. This method should be used in
conjunction with the `'manual'` mode of the <a href='/reference/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator.
### commitOpenTransaction

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => `}   />

Manually commits any open transaction. Should be very rarely needed, since the <a href='/reference/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator
and the internal TransactionInterceptor take care of this automatically. Use-cases include situations
in which the worker thread needs to access changes made in the current transaction, or when using the
Transaction decorator in manual mode.
### rollBackTransaction

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => `}   />

Manually rolls back any open transaction. Should be very rarely needed, since the <a href='/reference/typescript-api/request/transaction-decorator#transaction'>Transaction</a> decorator
and the internal TransactionInterceptor take care of this automatically. Use-cases include when using the
Transaction decorator in manual mode.
### getEntityOrThrow

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entityType: Type&#60;T&#62;, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, options: <a href='/reference/typescript-api/data-access/get-entity-or-throw-options#getentityorthrowoptions'>GetEntityOrThrowOptions</a>&#60;T&#62; = {}) => Promise&#60;T&#62;`}   />

Finds an entity of the given type by ID, or throws an `EntityNotFoundError` if none
is found.
### findOneInChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: Type&#60;T&#62;, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, channelId: <a href='/reference/typescript-api/common/id#id'>ID</a>, options: FindOneOptions&#60;T&#62; = {}) => `}   />

Like the TypeOrm `Repository.findOne()` method, but limits the results to
the given Channel.
### findByIdsInChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: Type&#60;T&#62;, ids: <a href='/reference/typescript-api/common/id#id'>ID</a>[], channelId: <a href='/reference/typescript-api/common/id#id'>ID</a>, options: FindManyOptions&#60;T&#62;) => `}   />

Like the TypeOrm `Repository.findByIds()` method, but limits the results to
the given Channel.


</div>
