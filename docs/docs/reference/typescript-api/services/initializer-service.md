---
title: "InitializerService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InitializerService

<GenerationInfo sourceFile="packages/core/src/service/initializer.service.ts" sourceLine="26" packageName="@vendure/core" />

Only used internally to run the various service init methods in the correct
sequence on bootstrap.

```ts title="Signature"
class InitializerService {
    constructor(connection: TransactionalConnection, zoneService: ZoneService, channelService: ChannelService, roleService: RoleService, administratorService: AdministratorService, shippingMethodService: ShippingMethodService, globalSettingsService: GlobalSettingsService, taxRateService: TaxRateService, sellerService: SellerService, eventBus: EventBus, stockLocationService: StockLocationService)
    onModuleInit() => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, zoneService: <a href='/reference/typescript-api/services/zone-service#zoneservice'>ZoneService</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, administratorService: <a href='/reference/typescript-api/services/administrator-service#administratorservice'>AdministratorService</a>, shippingMethodService: <a href='/reference/typescript-api/services/shipping-method-service#shippingmethodservice'>ShippingMethodService</a>, globalSettingsService: <a href='/reference/typescript-api/services/global-settings-service#globalsettingsservice'>GlobalSettingsService</a>, taxRateService: <a href='/reference/typescript-api/services/tax-rate-service#taxrateservice'>TaxRateService</a>, sellerService: <a href='/reference/typescript-api/services/seller-service#sellerservice'>SellerService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, stockLocationService: StockLocationService) => InitializerService`}   />


### onModuleInit

<MemberInfo kind="method" type={`() => `}   />




</div>
