---
title: "RequestContext"
weight: 10
date: 2023-07-14T16:57:49.375Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# RequestContext
<div class="symbol">


# RequestContext

{{< generation-info sourceFile="packages/core/src/api/common/request-context.ts" sourceLine="44" packageName="@vendure/core">}}

The RequestContext holds information relevant to the current request, which may be
required at various points of the stack.

It is a good practice to inject the RequestContext (using the <a href='/typescript-api/request/ctx-decorator#ctx'>Ctx</a> decorator) into
_all_ resolvers & REST handlers, and then pass it through to the service layer.

This allows the service layer to access information about the current user, the active language,
the active Channel, and so on. In addition, the <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> relies on the
presence of the RequestContext object in order to correctly handle per-request database transactions.

*Example*

```TypeScript
@Query()
myQuery(@Ctx() ctx: RequestContext) {
  return this.myService.getData(ctx);
}
```

## Signature

```TypeScript
class RequestContext {
  static empty() => RequestContext;
  static deserialize(ctxObject: SerializedRequestContext) => RequestContext;
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
## Members

### empty

{{< member-info kind="method" type="() => <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}Creates an "empty" RequestContext object. This is only intended to be used
when a service method must be called outside the normal request-response
cycle, e.g. when programmatically populating data. Usually a better alternative
is to use the <a href='/typescript-api/request/request-context-service#requestcontextservice'>RequestContextService</a> `create()` method, which allows more control
over the resulting RequestContext object.{{< /member-description >}}

### deserialize

{{< member-info kind="method" type="(ctxObject: SerializedRequestContext) => <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}Creates a new RequestContext object from a serialized object created by the
`serialize()` method.{{< /member-description >}}

### userHasPermissions

{{< member-info kind="method" type="(permissions: <a href='/typescript-api/common/permission#permission'>Permission</a>[]) => boolean"  >}}

{{< member-description >}}Returns `true` if there is an active Session & User associated with this request,
and that User has the specified permissions on the active Channel.{{< /member-description >}}

### serialize

{{< member-info kind="method" type="() => SerializedRequestContext"  >}}

{{< member-description >}}Serializes the RequestContext object into a JSON-compatible simple object.
This is useful when you need to send a RequestContext object to another
process, e.g. to pass it to the Job Queue via the <a href='/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a>.{{< /member-description >}}

### copy

{{< member-info kind="method" type="() => <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}Creates a shallow copy of the RequestContext instance. This means that
mutations to the copy itself will not affect the original, but deep mutations
(e.g. copy.channel.code = 'new') *will* also affect the original.{{< /member-description >}}

### req

{{< member-info kind="property" type="Request | undefined"  >}}

{{< member-description >}}The raw Express request object.{{< /member-description >}}

### apiType

{{< member-info kind="property" type="<a href='/typescript-api/request/api-type#apitype'>ApiType</a>"  >}}

{{< member-description >}}Signals which API this request was received by, e.g. `admin` or `shop`.{{< /member-description >}}

### channel

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>"  >}}

{{< member-description >}}The active <a href='/typescript-api/entities/channel#channel'>Channel</a> of this request.{{< /member-description >}}

### channelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### languageCode

{{< member-info kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### currencyCode

{{< member-info kind="property" type="<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### session

{{< member-info kind="property" type="<a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a> | undefined"  >}}

{{< member-description >}}{{< /member-description >}}

### activeUserId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a> | undefined"  >}}

{{< member-description >}}{{< /member-description >}}

### isAuthorized

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}True if the current session is authorized to access the current resolver method.{{< /member-description >}}

### authorizedAsOwnerOnly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}True if the current anonymous session is only authorized to operate on entities that
are owned by the current session.{{< /member-description >}}

### translate

{{< member-info kind="method" type="(key: string, variables?: { [k: string]: any }) => string"  >}}

{{< member-description >}}Translate the given i18n key{{< /member-description >}}


</div>
