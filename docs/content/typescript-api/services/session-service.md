---
title: "SessionService"
weight: 10
date: 2023-07-14T16:57:50.576Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SessionService
<div class="symbol">


# SessionService

{{< generation-info sourceFile="packages/core/src/service/services/session.service.ts" sourceLine="28" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/session#session'>Session</a> entities.

## Signature

```TypeScript
class SessionService implements EntitySubscriberInterface {
  constructor(connection: TransactionalConnection, configService: ConfigService, orderService: OrderService)
  async createNewAuthenticatedSession(ctx: RequestContext, user: User, authenticationStrategyName: string) => Promise<AuthenticatedSession>;
  async createAnonymousSession() => Promise<CachedSession>;
  async getSessionFromToken(sessionToken: string) => Promise<CachedSession | undefined>;
  serializeSession(session: AuthenticatedSession | AnonymousSession) => CachedSession;
  async setActiveOrder(ctx: RequestContext, serializedSession: CachedSession, order: Order) => Promise<CachedSession>;
  async unsetActiveOrder(ctx: RequestContext, serializedSession: CachedSession) => Promise<CachedSession>;
  async setActiveChannel(serializedSession: CachedSession, channel: Channel) => Promise<CachedSession>;
  async deleteSessionsByUser(ctx: RequestContext, user: User) => Promise<void>;
  async deleteSessionsByActiveOrderId(ctx: RequestContext, activeOrderId: ID) => Promise<void>;
}
```
## Implements

 * EntitySubscriberInterface


## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, orderService: <a href='/typescript-api/services/order-service#orderservice'>OrderService</a>) => SessionService"  >}}

{{< member-description >}}{{< /member-description >}}

### createNewAuthenticatedSession

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>, authenticationStrategyName: string) => Promise&#60;<a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>&#62;"  >}}

{{< member-description >}}Creates a new <a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>. To be used after successful authentication.{{< /member-description >}}

### createAnonymousSession

{{< member-info kind="method" type="() => Promise&#60;<a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;"  >}}

{{< member-description >}}Create an <a href='/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a> and caches it using the configured <a href='/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a>,
and returns the cached session object.{{< /member-description >}}

### getSessionFromToken

{{< member-info kind="method" type="(sessionToken: string) => Promise&#60;<a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined&#62;"  >}}

{{< member-description >}}Returns the cached session object matching the given session token.{{< /member-description >}}

### serializeSession

{{< member-info kind="method" type="(session: <a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> | <a href='/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a>) => <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>"  >}}

{{< member-description >}}Serializes a <a href='/typescript-api/entities/session#session'>Session</a> instance into a simplified plain object suitable for caching.{{< /member-description >}}

### setActiveOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, serializedSession: <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;"  >}}

{{< member-description >}}Sets the `activeOrder` on the given cached session object and updates the cache.{{< /member-description >}}

### unsetActiveOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, serializedSession: <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => Promise&#60;<a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;"  >}}

{{< member-description >}}Clears the `activeOrder` on the given cached session object and updates the cache.{{< /member-description >}}

### setActiveChannel

{{< member-info kind="method" type="(serializedSession: <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>, channel: <a href='/typescript-api/entities/channel#channel'>Channel</a>) => Promise&#60;<a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>&#62;"  >}}

{{< member-description >}}Sets the `activeChannel` on the given cached session object and updates the cache.{{< /member-description >}}

### deleteSessionsByUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Deletes all existing sessions for the given user.{{< /member-description >}}

### deleteSessionsByActiveOrderId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, activeOrderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Deletes all existing sessions with the given activeOrder.{{< /member-description >}}


</div>
