---
title: "RequestContextService"
weight: 10
date: 2023-07-14T16:57:50.263Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# RequestContextService
<div class="symbol">


# RequestContextService

{{< generation-info sourceFile="packages/core/src/service/helpers/request-context/request-context.service.ts" sourceLine="24" packageName="@vendure/core">}}

Creates new <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> instances.

## Signature

```TypeScript
class RequestContextService {
  async create(config: {
        req?: Request;
        apiType: ApiType;
        channelOrToken?: Channel | string;
        languageCode?: LanguageCode;
        currencyCode?: CurrencyCode;
        user?: User;
        activeOrderId?: ID;
    }) => Promise<RequestContext>;
  async fromRequest(req: Request, info?: GraphQLResolveInfo, requiredPermissions?: Permission[], session?: CachedSession) => Promise<RequestContext>;
}
```
## Members

### create

{{< member-info kind="method" type="(config: {         req?: Request;         apiType: <a href='/typescript-api/request/api-type#apitype'>ApiType</a>;         channelOrToken?: <a href='/typescript-api/entities/channel#channel'>Channel</a> | string;         languageCode?: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         currencyCode?: <a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>;         user?: <a href='/typescript-api/entities/user#user'>User</a>;         activeOrderId?: <a href='/typescript-api/common/id#id'>ID</a>;     }) => Promise&#60;<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>&#62;"  since="1.5.0" >}}

{{< member-description >}}Creates a RequestContext based on the config provided. This can be useful when interacting
with services outside the request-response cycle, for example in stand-alone scripts or in
worker jobs.{{< /member-description >}}

### fromRequest

{{< member-info kind="method" type="(req: Request, info?: GraphQLResolveInfo, requiredPermissions?: <a href='/typescript-api/common/permission#permission'>Permission</a>[], session?: <a href='/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => Promise&#60;<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>&#62;"  >}}

{{< member-description >}}Creates a new RequestContext based on an Express request object. This is used internally
in the API layer by the AuthGuard, and creates the RequestContext which is then passed
to all resolvers & controllers.{{< /member-description >}}


</div>
