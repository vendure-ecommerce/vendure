---
title: "GlobalSettingsService"
weight: 10
date: 2023-07-14T16:57:50.400Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# GlobalSettingsService
<div class="symbol">


# GlobalSettingsService

{{< generation-info sourceFile="packages/core/src/service/services/global-settings.service.ts" sourceLine="21" packageName="@vendure/core">}}

Contains methods relating to the {@link GlobalSettings} entity.

## Signature

```TypeScript
class GlobalSettingsService {
  constructor(connection: TransactionalConnection, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, requestCache: RequestContextCacheService)
  async getSettings(ctx: RequestContext) => Promise<GlobalSettings>;
  async updateSettings(ctx: RequestContext, input: UpdateGlobalSettingsInput) => Promise<GlobalSettings>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, requestCache: RequestContextCacheService) => GlobalSettingsService"  >}}

{{< member-description >}}{{< /member-description >}}

### getSettings

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;GlobalSettings&#62;"  >}}

{{< member-description >}}Returns the GlobalSettings entity.{{< /member-description >}}

### updateSettings

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateGlobalSettingsInput) => Promise&#60;GlobalSettings&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
