---
title: "RequestContext"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RequestContext

<GenerationInfo sourceFile="packages/core/src/api/common/request-context.ts" sourceLine="44" packageName="@vendure/core" />

The RequestContext holds information relevant to the current request, which may be
required at various points of the stack.

It is a good practice to inject the RequestContext (using the <a href='/reference/typescript-api/request/ctx-decorator#ctx'>Ctx</a> decorator) into
_all_ resolvers & REST handler, and then pass it through to the service layer.

This allows the service layer to access information about the current user, the active language,
the active Channel, and so on. In addition, the <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> relies on the
presence of the RequestContext object in order to correctly handle per-request database transactions.

*Example*

```ts
@Query()
myQuery(@Ctx() ctx: RequestContext) {
  return this.myService.getData(ctx);
}
```

```ts title="Signature"
class RequestContext {
    empty() => RequestContext;
    deserialize(ctxObject: SerializedRequestContext) => RequestContext;
    userHasPermissions(permissions: Permission[]) => boolean;
    serialize() => SerializedRequestContext;
    copy() => RequestContext;
    req: Request | undefined
    apiType: ApiType
    channel: Channel
    channelId: ID
    languageCode: LanguageCode
    currencyCode: CurrencyCode
    session: CachedSession | undefined
    activeUserId: ID | undefined
    isAuthorized: boolean
    authorizedAsOwnerOnly: boolean
    translate(key: string, variables?: { [k: string]: any }) => string;
}
```

<div className="members-wrapper">

### empty

<MemberInfo kind="method" type={`() => <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />

Creates an "empty" RequestContext object. This is only intended to be used
when a service method must be called outside the normal request-response
cycle, e.g. when programmatically populating data. Usually a better alternative
is to use the <a href='/reference/typescript-api/request/request-context-service#requestcontextservice'>RequestContextService</a> `create()` method, which allows more control
over the resulting RequestContext object.
### deserialize

<MemberInfo kind="method" type={`(ctxObject: SerializedRequestContext) => <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />

Creates a new RequestContext object from a serialized object created by the
`serialize()` method.
### userHasPermissions

<MemberInfo kind="method" type={`(permissions: <a href='/reference/typescript-api/common/permission#permission'>Permission</a>[]) => boolean`}   />

Returns `true` if there is an active Session & User associated with this request,
and that User has the specified permissions on the active Channel.
### serialize

<MemberInfo kind="method" type={`() => SerializedRequestContext`}   />

Serializes the RequestContext object into a JSON-compatible simple object.
This is useful when you need to send a RequestContext object to another
process, e.g. to pass it to the Job Queue via the <a href='/reference/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a>.
### copy

<MemberInfo kind="method" type={`() => <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />

Creates a shallow copy of the RequestContext instance. This means that
mutations to the copy itself will not affect the original, but deep mutations
(e.g. copy.channel.code = 'new') *will* also affect the original.
### req

<MemberInfo kind="property" type={`Request | undefined`}   />

The raw Express request object.
### apiType

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/request/api-type#apitype'>ApiType</a>`}   />

Signals which API this request was received by, e.g. `admin` or `shop`.
### channel

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>`}   />

The active <a href='/reference/typescript-api/entities/channel#channel'>Channel</a> of this request.
### channelId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### languageCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>`}   />


### currencyCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>`}   />


### session

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined`}   />


### activeUserId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a> | undefined`}   />


### isAuthorized

<MemberInfo kind="property" type={`boolean`}   />

True if the current session is authorized to access the current resolver method.
### authorizedAsOwnerOnly

<MemberInfo kind="property" type={`boolean`}   />

True if the current anonymous session is only authorized to operate on entities that
are owned by the current session.
### translate

<MemberInfo kind="method" type={`(key: string, variables?: { [k: string]: any }) => string`}   />

Translate the given i18n key


</div>
