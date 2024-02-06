---
title: "AuthService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AuthService

<GenerationInfo sourceFile="packages/core/src/service/services/auth.service.ts" sourceLine="36" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/session#session'>Session</a>, <a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> & <a href='/reference/typescript-api/entities/anonymous-session#anonymoussession'>AnonymousSession</a> entities.

```ts title="Signature"
class AuthService {
    constructor(connection: TransactionalConnection, configService: ConfigService, sessionService: SessionService, eventBus: EventBus)
    authenticate(ctx: RequestContext, apiType: ApiType, authenticationMethod: string, authenticationData: any) => Promise<AuthenticatedSession | InvalidCredentialsError | NotVerifiedError>;
    createAuthenticatedSessionForUser(ctx: RequestContext, user: User, authenticationStrategyName: string) => Promise<AuthenticatedSession | NotVerifiedError>;
    verifyUserPassword(ctx: RequestContext, userId: ID, password: string) => Promise<boolean | InvalidCredentialsError | ShopInvalidCredentialsError>;
    destroyAuthenticatedSession(ctx: RequestContext, sessionToken: string) => Promise<void>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, sessionService: <a href='/reference/typescript-api/services/session-service#sessionservice'>SessionService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>) => AuthService`}   />


### authenticate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, apiType: <a href='/reference/typescript-api/request/api-type#apitype'>ApiType</a>, authenticationMethod: string, authenticationData: any) => Promise&#60;<a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> | InvalidCredentialsError | NotVerifiedError&#62;`}   />

Authenticates a user's credentials and if okay, creates a new <a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a>.
### createAuthenticatedSessionForUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>, authenticationStrategyName: string) => Promise&#60;<a href='/reference/typescript-api/entities/authenticated-session#authenticatedsession'>AuthenticatedSession</a> | NotVerifiedError&#62;`}   />


### verifyUserPassword

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>, password: string) => Promise&#60;boolean | InvalidCredentialsError | ShopInvalidCredentialsError&#62;`}   />

Verify the provided password against the one we have for the given user. Requires
the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a> to be configured.
### destroyAuthenticatedSession

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, sessionToken: string) => Promise&#60;void&#62;`}   />

Deletes all sessions for the user associated with the given session token.


</div>
