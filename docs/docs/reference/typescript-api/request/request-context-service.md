---
title: "RequestContextService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RequestContextService

<GenerationInfo sourceFile="packages/core/src/service/helpers/request-context/request-context.service.ts" sourceLine="25" packageName="@vendure/core" />

Creates new <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> instances.

```ts title="Signature"
class RequestContextService {
    create(config: {
        req?: Request;
        apiType: ApiType;
        channelOrToken?: Channel | string;
        languageCode?: LanguageCode;
        currencyCode?: CurrencyCode;
        user?: User;
        activeOrderId?: ID;
    }) => Promise<RequestContext>;
    fromRequest(req: Request, info?: GraphQLResolveInfo, requiredPermissions?: Permission[], session?: CachedSession) => Promise<RequestContext>;
}
```

<div className="members-wrapper">

### create

<MemberInfo kind="method" type={`(config: {         req?: Request;         apiType: <a href='/reference/typescript-api/request/api-type#apitype'>ApiType</a>;         channelOrToken?: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a> | string;         languageCode?: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>;         currencyCode?: <a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>;         user?: <a href='/reference/typescript-api/entities/user#user'>User</a>;         activeOrderId?: <a href='/reference/typescript-api/common/id#id'>ID</a>;     }) => Promise&#60;<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>&#62;`}  since="1.5.0"  />

Creates a RequestContext based on the config provided. This can be useful when interacting
with services outside the request-response cycle, for example in stand-alone scripts or in
worker jobs.
### fromRequest

<MemberInfo kind="method" type={`(req: Request, info?: GraphQLResolveInfo, requiredPermissions?: <a href='/reference/typescript-api/common/permission#permission'>Permission</a>[], session?: <a href='/reference/typescript-api/auth/session-cache-strategy#cachedsession'>CachedSession</a>) => Promise&#60;<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>&#62;`}   />

Creates a new RequestContext based on an Express request object. This is used internally
in the API layer by the AuthGuard, and creates the RequestContext which is then passed
to all resolvers & controllers.


</div>
