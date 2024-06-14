---
title: "GlobalSettingsService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## GlobalSettingsService

<GenerationInfo sourceFile="packages/core/src/service/services/global-settings.service.ts" sourceLine="22" packageName="@vendure/core" />

Contains methods relating to the <a href='/reference/typescript-api/entities/global-settings#globalsettings'>GlobalSettings</a> entity.

```ts title="Signature"
class GlobalSettingsService {
    constructor(connection: TransactionalConnection, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, requestCache: RequestContextCacheService)
    getSettings(ctx: RequestContext) => Promise<GlobalSettings>;
    updateSettings(ctx: RequestContext, input: UpdateGlobalSettingsInput) => Promise<GlobalSettings>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, requestCache: RequestContextCacheService) => GlobalSettingsService`}   />


### getSettings

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/entities/global-settings#globalsettings'>GlobalSettings</a>&#62;`}   />

Returns the GlobalSettings entity.
### updateSettings

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateGlobalSettingsInput) => Promise&#60;<a href='/reference/typescript-api/entities/global-settings#globalsettings'>GlobalSettings</a>&#62;`}   />




</div>
