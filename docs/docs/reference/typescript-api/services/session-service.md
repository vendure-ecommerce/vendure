---
title: "SessionService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SessionService

<GenerationInfo sourceFile="packages/core/src/service/services/session.service.ts" sourceLine="28" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/session#session'>Session</a> entities.

```ts title="Signature"
class SessionService implements EntitySubscriberInterface {
    constructor(connection: TransactionalConnection, configService: ConfigService, orderService: OrderService)
    createNewAuthenticatedSession(ctx: RequestContext, user: User, authenticationStrategyName: string) => Promise<AuthenticatedSession>;
    createAnonymousSession() => Promise<CachedSession>;
    getSessionFromToken(sessionToken: string) => Promise<CachedSession | undefined>;
    serializeSession(session: AuthenticatedSession | AnonymousSession) => CachedSession;
    setActiveOrder(ctx: RequestContext, serializedSession: CachedSession, order: Order) => Promise<CachedSession>;
    unsetActiveOrder(ctx: RequestContext, serializedSession: CachedSession) => Promise<CachedSession>;
    setActiveChannel(serializedSession: CachedSession, channel: Channel) => Promise<CachedSession>;
    deleteSessionsByUser(ctx: RequestContext, user: User) => Promise<void>;
    deleteSessionsByActiveOrderId(ctx: RequestContext, activeOrderId: ID) => Promise<void>;
}
```
* Implements: <code>EntitySubscriberInterface</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, orderService: <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a>) => SessionService`}   />


### createNewAuthenticatedSession

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>, authenticationStrategyName: string) => Promise&#60;<a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>&#62;`}   />

Creates a new <a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>. To be used after successful authentication.
### createAnonymousSession

<MemberInfo kind="method" type={`() => Promise&#60;<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;`}   />

Create an <a href='/reference/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a> and caches it using the configured <a href='/reference/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a>,
and returns the cached session object.
### getSessionFromToken

<MemberInfo kind="method" type={`(sessionToken: string) => Promise&#60;<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined&#62;`}   />

Returns the cached session object matching the given session token.
### serializeSession

<MemberInfo kind="method" type={`(session: <a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> | <a href='/reference/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a>) => <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>`}   />

Serializes a <a href='/reference/typescript-api/entities/session#session'>Session</a> instance into a simplified plain object suitable for caching.
### setActiveOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, serializedSession: <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;`}   />

Sets the `activeOrder` on the given cached session object and updates the cache.
### unsetActiveOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, serializedSession: <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => Promise&#60;<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;`}   />

Clears the `activeOrder` on the given cached session object and updates the cache.
### setActiveChannel

<MemberInfo kind="method" type={`(serializedSession: <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>, channel: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>) => Promise&#60;<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;`}   />

Sets the `activeChannel` on the given cached session object and updates the cache.
### deleteSessionsByUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => Promise&#60;void&#62;`}   />

Deletes all existing sessions for the given user.
### deleteSessionsByActiveOrderId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, activeOrderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;void&#62;`}   />

Deletes all existing sessions with the given activeOrder.


</div>
