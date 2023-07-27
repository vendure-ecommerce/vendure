---
title: "AuthService"
weight: 10
date: 2023-07-14T16:57:50.294Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AuthService
<div class="symbol">


# AuthService

{{< generation-info sourceFile="packages/core/src/service/services/auth.service.ts" sourceLine="36" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/session#session'>Session</a>, <a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> & <a href='/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a> entities.

## Signature

```TypeScript
class AuthService {
  constructor(connection: TransactionalConnection, configService: ConfigService, sessionService: SessionService, eventBus: EventBus)
  async authenticate(ctx: RequestContext, apiType: ApiType, authenticationMethod: string, authenticationData: any) => Promise<AuthenticatedSession | InvalidCredentialsError | NotVerifiedError>;
  async createAuthenticatedSessionForUser(ctx: RequestContext, user: User, authenticationStrategyName: string) => Promise<AuthenticatedSession | NotVerifiedError>;
  async verifyUserPassword(ctx: RequestContext, userId: ID, password: string) => Promise<boolean | InvalidCredentialsError | ShopInvalidCredentialsError>;
  async destroyAuthenticatedSession(ctx: RequestContext, sessionToken: string) => Promise<void>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, sessionService: <a href='/typescript-api/services/session-service#sessionservice'>SessionService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>) => AuthService"  >}}

{{< member-description >}}{{< /member-description >}}

### authenticate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, apiType: <a href='/typescript-api/request/api-type#apitype'>ApiType</a>, authenticationMethod: string, authenticationData: any) => Promise&#60;<a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> | InvalidCredentialsError | NotVerifiedError&#62;"  >}}

{{< member-description >}}Authenticates a user's credentials and if okay, creates a new <a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>.{{< /member-description >}}

### createAuthenticatedSessionForUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>, authenticationStrategyName: string) => Promise&#60;<a href='/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> | NotVerifiedError&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### verifyUserPassword

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>, password: string) => Promise&#60;boolean | InvalidCredentialsError | ShopInvalidCredentialsError&#62;"  >}}

{{< member-description >}}Verify the provided password against the one we have for the given user. Requires
the <a href='/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a> to be configured.{{< /member-description >}}

### destroyAuthenticatedSession

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, sessionToken: string) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Deletes all sessions for the user associated with the given session token.{{< /member-description >}}


</div>
