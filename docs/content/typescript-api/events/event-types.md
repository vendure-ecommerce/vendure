---
title: "Event Types"
weight: 10
date: 2023-07-14T16:57:50.050Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Event Types
<div class="symbol">


# AccountRegistrationEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/account-registration-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired when a new user registers an account, either as a stand-alone signup or after
placing an order.

## Signature

```TypeScript
class AccountRegistrationEvent extends VendureEvent {
  constructor(ctx: RequestContext, user: User)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => AccountRegistrationEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# AccountVerifiedEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/account-verified-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired when a users email address successfully gets verified after
the `verifyCustomerAccount` mutation was executed.

## Signature

```TypeScript
class AccountVerifiedEvent extends VendureEvent {
  constructor(ctx: RequestContext, customer: Customer)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customer: <a href='/typescript-api/entities/customer#customer'>Customer</a>) => AccountVerifiedEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# AdministratorEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/administrator-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/administrator#administrator'>Administrator</a> is added, updated or deleted.

## Signature

```TypeScript
class AdministratorEvent extends VendureEntityEvent<Administrator, AdministratorInputTypes> {
  constructor(ctx: RequestContext, entity: Administrator, type: 'created' | 'updated' | 'deleted', input?: AdministratorInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>, AdministratorInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/administrator#administrator'>Administrator</a>, type: 'created' | 'updated' | 'deleted', input?: AdministratorInputTypes) => AdministratorEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# AssetChannelEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/asset-channel-event.ts" sourceLine="15" packageName="@vendure/core">}}

This event is fired whenever an <a href='/typescript-api/entities/asset#asset'>Asset</a> is assigned or removed
From a channel.

## Signature

```TypeScript
class AssetChannelEvent extends VendureEvent {
  constructor(ctx: RequestContext, asset: Asset, channelId: ID, type: 'assigned' | 'removed')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, asset: <a href='/typescript-api/entities/asset#asset'>Asset</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => AssetChannelEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# AssetEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/asset-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/asset#asset'>Asset</a> is added, updated or deleted.

## Signature

```TypeScript
class AssetEvent extends VendureEntityEvent<Asset, AssetInputTypes> {
  constructor(ctx: RequestContext, entity: Asset, type: 'created' | 'updated' | 'deleted', input?: AssetInputTypes)
  asset: Asset
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>, AssetInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/asset#asset'>Asset</a>, type: 'created' | 'updated' | 'deleted', input?: AssetInputTypes) => AssetEvent"  >}}

{{< member-description >}}{{< /member-description >}}

### asset

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"  since="1.4" >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# AttemptedLoginEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/attempted-login-event.ts" sourceLine="14" packageName="@vendure/core">}}

This event is fired when an attempt is made to log in via the shop or admin API `login` mutation.
The `strategy` represents the name of the AuthenticationStrategy used in the login attempt.
If the "native" strategy is used, the additional `identifier` property will be available.

## Signature

```TypeScript
class AttemptedLoginEvent extends VendureEvent {
  constructor(ctx: RequestContext, strategy: string, identifier?: string)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, identifier?: string) => AttemptedLoginEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ChangeChannelEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/change-channel-event.ts" sourceLine="17" packageName="@vendure/core" since="1.4">}}

This event is fired whenever an <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a> entity is assigned or removed
from a channel. The entity property contains the value before updating the channels.

## Signature

```TypeScript
class ChangeChannelEvent<T extends ChannelAware & VendureEntity> extends VendureEvent {
  constructor(ctx: RequestContext, entity: T, channelIds: ID[], type: 'assigned' | 'removed', entityType?: Type<T>)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T, channelIds: <a href='/typescript-api/common/id#id'>ID</a>[], type: 'assigned' | 'removed', entityType?: Type&#60;T&#62;) => ChangeChannelEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ChannelEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/channel-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/channel#channel'>Channel</a> is added, updated or deleted.

## Signature

```TypeScript
class ChannelEvent extends VendureEntityEvent<Channel, ChannelInputTypes> {
  constructor(ctx: RequestContext, entity: Channel, type: 'created' | 'updated' | 'deleted', input?: ChannelInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>, ChannelInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/channel#channel'>Channel</a>, type: 'created' | 'updated' | 'deleted', input?: ChannelInputTypes) => ChannelEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CollectionEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/collection-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/collection#collection'>Collection</a> is added, updated or deleted.

## Signature

```TypeScript
class CollectionEvent extends VendureEntityEvent<Collection, CollectionInputTypes> {
  constructor(ctx: RequestContext, entity: Collection, type: 'created' | 'updated' | 'deleted', input?: CollectionInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>, CollectionInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/collection#collection'>Collection</a>, type: 'created' | 'updated' | 'deleted', input?: CollectionInputTypes) => CollectionEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CollectionModificationEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/collection-modification-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a Collection is modified in some way. The `productVariantIds`
argument is an array of ids of all ProductVariants which:

1. were part of this collection prior to modification and are no longer
2. are now part of this collection after modification but were not before

## Signature

```TypeScript
class CollectionModificationEvent extends VendureEvent {
  constructor(ctx: RequestContext, collection: Collection, productVariantIds: ID[])
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collection: <a href='/typescript-api/entities/collection#collection'>Collection</a>, productVariantIds: <a href='/typescript-api/common/id#id'>ID</a>[]) => CollectionModificationEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CountryEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/country-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/country#country'>Country</a> is added, updated or deleted.

## Signature

```TypeScript
class CountryEvent extends VendureEntityEvent<Country, CountryInputTypes> {
  constructor(ctx: RequestContext, entity: Country, type: 'created' | 'updated' | 'deleted', input?: CountryInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/country#country'>Country</a>, CountryInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/country#country'>Country</a>, type: 'created' | 'updated' | 'deleted', input?: CountryInputTypes) => CountryEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CouponCodeEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/coupon-code-event.ts" sourceLine="15" packageName="@vendure/core" since="1.4">}}

This event is fired whenever an coupon code of an active <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>
is assigned or removed to an <a href='/typescript-api/entities/order#order'>Order</a>.

## Signature

```TypeScript
class CouponCodeEvent extends VendureEvent {
  constructor(ctx: RequestContext, couponCode: string, orderId: ID, type: 'assigned' | 'removed')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, couponCode: string, orderId: <a href='/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => CouponCodeEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CustomerAddressEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/customer-address-event.ts" sourceLine="22" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/address#address'>Address</a> is added, updated
or deleted.

## Signature

```TypeScript
class CustomerAddressEvent extends VendureEntityEvent<Address, CustomerAddressInputTypes> {
  constructor(ctx: RequestContext, entity: Address, type: 'created' | 'updated' | 'deleted', input?: CustomerAddressInputTypes)
  address: Address
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/address#address'>Address</a>, CustomerAddressInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/address#address'>Address</a>, type: 'created' | 'updated' | 'deleted', input?: CustomerAddressInputTypes) => CustomerAddressEvent"  >}}

{{< member-description >}}{{< /member-description >}}

### address

{{< member-info kind="property" type="<a href='/typescript-api/entities/address#address'>Address</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CustomerEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/customer-event.ts" sourceLine="22" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/customer#customer'>Customer</a> is added, updated
or deleted.

## Signature

```TypeScript
class CustomerEvent extends VendureEntityEvent<Customer, CustomerInputTypes> {
  constructor(ctx: RequestContext, entity: Customer, type: 'created' | 'updated' | 'deleted', input?: CustomerInputTypes)
  customer: Customer
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/customer#customer'>Customer</a>, CustomerInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/customer#customer'>Customer</a>, type: 'created' | 'updated' | 'deleted', input?: CustomerInputTypes) => CustomerEvent"  >}}

{{< member-description >}}{{< /member-description >}}

### customer

{{< member-info kind="property" type="<a href='/typescript-api/entities/customer#customer'>Customer</a>"  since="1.4" >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CustomerGroupChangeEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/customer-group-change-event.ts" sourceLine="15" packageName="@vendure/core" since="1.4">}}

This event is fired whenever one or more <a href='/typescript-api/entities/customer#customer'>Customer</a> is assigned to or removed from a
<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>.

## Signature

```TypeScript
class CustomerGroupChangeEvent extends VendureEvent {
  constructor(ctx: RequestContext, customers: Customer[], customGroup: CustomerGroup, type: 'assigned' | 'removed')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customers: <a href='/typescript-api/entities/customer#customer'>Customer</a>[], customGroup: <a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>, type: 'assigned' | 'removed') => CustomerGroupChangeEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CustomerGroupEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/customer-group-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> is added, updated or deleted.

## Signature

```TypeScript
class CustomerGroupEvent extends VendureEntityEvent<CustomerGroup, CustomerGroupInputTypes> {
  constructor(ctx: RequestContext, entity: CustomerGroup, type: 'created' | 'updated' | 'deleted', input?: CustomerGroupInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>, CustomerGroupInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>, type: 'created' | 'updated' | 'deleted', input?: CustomerGroupInputTypes) => CustomerGroupEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# FacetEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/facet-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/facet#facet'>Facet</a> is added, updated or deleted.

## Signature

```TypeScript
class FacetEvent extends VendureEntityEvent<Facet, FacetInputTypes> {
  constructor(ctx: RequestContext, entity: Facet, type: 'created' | 'updated' | 'deleted', input?: FacetInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>, FacetInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/facet#facet'>Facet</a>, type: 'created' | 'updated' | 'deleted', input?: FacetInputTypes) => FacetEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# FacetValueEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/facet-value-event.ts" sourceLine="26" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a> is added, updated or deleted.

## Signature

```TypeScript
class FacetValueEvent extends VendureEntityEvent<FacetValue, FacetValueInputTypes> {
  constructor(ctx: RequestContext, entity: FacetValue, type: 'created' | 'updated' | 'deleted', input?: FacetValueInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>, FacetValueInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>, type: 'created' | 'updated' | 'deleted', input?: FacetValueInputTypes) => FacetValueEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# FulfillmentEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/fulfillment-event.ts" sourceLine="27" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> is added. The type is always `created`.

## Signature

```TypeScript
class FulfillmentEvent extends VendureEntityEvent<Fulfillment, CreateFulfillmentInput> {
  constructor(ctx: RequestContext, entity: Fulfillment, input?: CreateFulfillmentInput)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>, CreateFulfillmentInput&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>, input?: CreateFulfillmentInput) => FulfillmentEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# FulfillmentStateTransitionEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/fulfillment-state-transition-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired whenever an <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> transitions from one <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a> to another.

## Signature

```TypeScript
class FulfillmentStateTransitionEvent extends VendureEvent {
  constructor(fromState: FulfillmentState, toState: FulfillmentState, ctx: RequestContext, fulfillment: Fulfillment)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(fromState: <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>, toState: <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fulfillment: <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>) => FulfillmentStateTransitionEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# GlobalSettingsEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/global-settings-event.ts" sourceLine="16" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a {@link GlobalSettings} is added. The type is always `updated`, because it's
only created once and never deleted.

## Signature

```TypeScript
class GlobalSettingsEvent extends VendureEntityEvent<GlobalSettings, UpdateGlobalSettingsInput> {
  constructor(ctx: RequestContext, entity: GlobalSettings, input?: UpdateGlobalSettingsInput)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;GlobalSettings, UpdateGlobalSettingsInput&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: GlobalSettings, input?: UpdateGlobalSettingsInput) => GlobalSettingsEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# HistoryEntryEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/history-entry-event.ts" sourceLine="23" packageName="@vendure/core" since="1.4">}}

This event is fired whenever one <a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a> is added, updated or deleted.

## Signature

```TypeScript
class HistoryEntryEvent extends VendureEntityEvent<HistoryEntry, HistoryInput> {
  public readonly public readonly historyType: 'order' | 'customer' | string;
  constructor(ctx: RequestContext, entity: HistoryEntry, type: 'created' | 'updated' | 'deleted', historyType: 'order' | 'customer' | string, input?: HistoryInput)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>, HistoryInput&#62;


## Members

### historyType

{{< member-info kind="property" type="'order' | 'customer' | string"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>, type: 'created' | 'updated' | 'deleted', historyType: 'order' | 'customer' | string, input?: HistoryInput) => HistoryEntryEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# IdentifierChangeEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/identifier-change-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired when a registered user successfully changes the identifier (ie email address)
associated with their account.

## Signature

```TypeScript
class IdentifierChangeEvent extends VendureEvent {
  constructor(ctx: RequestContext, user: User, oldIdentifier: string)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>, oldIdentifier: string) => IdentifierChangeEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# IdentifierChangeRequestEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/identifier-change-request-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired when a registered user requests to update the identifier (ie email address)
associated with the account.

## Signature

```TypeScript
class IdentifierChangeRequestEvent extends VendureEvent {
  constructor(ctx: RequestContext, user: User)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => IdentifierChangeRequestEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# InitializerEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/initializer-event.ts" sourceLine="11" packageName="@vendure/core" since="1.7.0">}}

This event is fired when vendure finished initializing its services inside the {@code InitializerService}

## Signature

```TypeScript
class InitializerEvent extends VendureEvent {
  constructor()
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="() => InitializerEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# LoginEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/login-event.ts" sourceLine="12" packageName="@vendure/core">}}

This event is fired when a user successfully logs in via the shop or admin API `login` mutation.

## Signature

```TypeScript
class LoginEvent extends VendureEvent {
  constructor(ctx: RequestContext, user: User)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => LoginEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# LogoutEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/logout-event.ts" sourceLine="12" packageName="@vendure/core">}}

This event is fired when a user logs out via the shop or admin API `logout` mutation.

## Signature

```TypeScript
class LogoutEvent extends VendureEvent {
  constructor(ctx: RequestContext)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => LogoutEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# OrderEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/order-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired whenever an <a href='/typescript-api/entities/order#order'>Order</a> is added, updated
or deleted.

## Signature

```TypeScript
class OrderEvent extends VendureEvent {
  constructor(ctx: RequestContext, order: Order, type: 'created' | 'updated' | 'deleted')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, type: 'created' | 'updated' | 'deleted') => OrderEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# OrderLineEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/order-line-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired whenever an <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a> is added, updated
or deleted.

## Signature

```TypeScript
class OrderLineEvent extends VendureEvent {
  constructor(ctx: RequestContext, order: Order, orderLine: OrderLine, type: 'created' | 'updated' | 'deleted')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, type: 'created' | 'updated' | 'deleted') => OrderLineEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# OrderPlacedEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/order-placed-event.ts" sourceLine="17" packageName="@vendure/core">}}

This event is fired whenever an <a href='/typescript-api/entities/order#order'>Order</a> is set as "placed", which by default is
when it transitions from 'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.

Note that the exact point that it is set as "placed" can be configured according to the
<a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>.

## Signature

```TypeScript
class OrderPlacedEvent extends VendureEvent {
  constructor(fromState: OrderState, toState: OrderState, ctx: RequestContext, order: Order)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => OrderPlacedEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# OrderStateTransitionEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/order-state-transition-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired whenever an <a href='/typescript-api/entities/order#order'>Order</a> transitions from one <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a> to another.

## Signature

```TypeScript
class OrderStateTransitionEvent extends VendureEvent {
  constructor(fromState: OrderState, toState: OrderState, ctx: RequestContext, order: Order)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(fromState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => OrderStateTransitionEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PasswordResetEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/password-reset-event.ts" sourceLine="12" packageName="@vendure/core">}}

This event is fired when a Customer requests a password reset email.

## Signature

```TypeScript
class PasswordResetEvent extends VendureEvent {
  constructor(ctx: RequestContext, user: User)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => PasswordResetEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PasswordResetVerifiedEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/password-reset-verified-event.ts" sourceLine="13" packageName="@vendure/core" since="1.4">}}

This event is fired when a password reset is executed with a verified token.

## Signature

```TypeScript
class PasswordResetVerifiedEvent extends VendureEvent {
  constructor(ctx: RequestContext, user: User)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>) => PasswordResetVerifiedEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PaymentMethodEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/payment-method-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a> is added, updated
or deleted.

## Signature

```TypeScript
class PaymentMethodEvent extends VendureEntityEvent<PaymentMethod, PaymentMethodInputTypes> {
  constructor(ctx: RequestContext, entity: PaymentMethod, type: 'created' | 'updated' | 'deleted', input?: PaymentMethodInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>, PaymentMethodInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>, type: 'created' | 'updated' | 'deleted', input?: PaymentMethodInputTypes) => PaymentMethodEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PaymentStateTransitionEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/payment-state-transition-event.ts" sourceLine="15" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/payment#payment'>Payment</a> transitions from one <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> to another, e.g.
a Payment is authorized by the payment provider.

## Signature

```TypeScript
class PaymentStateTransitionEvent extends VendureEvent {
  constructor(fromState: PaymentState, toState: PaymentState, ctx: RequestContext, payment: Payment, order: Order)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(fromState: <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, toState: <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, payment: <a href='/typescript-api/entities/payment#payment'>Payment</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => PaymentStateTransitionEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductChannelEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/product-channel-event.ts" sourceLine="15" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/product#product'>Product</a> is added, updated
or deleted.

## Signature

```TypeScript
class ProductChannelEvent extends VendureEvent {
  constructor(ctx: RequestContext, product: Product, channelId: ID, type: 'assigned' | 'removed')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, product: <a href='/typescript-api/entities/product#product'>Product</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => ProductChannelEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/product-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/product#product'>Product</a> is added, updated
or deleted.

## Signature

```TypeScript
class ProductEvent extends VendureEntityEvent<Product, ProductInputTypes> {
  constructor(ctx: RequestContext, entity: Product, type: 'created' | 'updated' | 'deleted', input?: ProductInputTypes)
  product: Product
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/product#product'>Product</a>, ProductInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/product#product'>Product</a>, type: 'created' | 'updated' | 'deleted', input?: ProductInputTypes) => ProductEvent"  >}}

{{< member-description >}}{{< /member-description >}}

### product

{{< member-info kind="property" type="<a href='/typescript-api/entities/product#product'>Product</a>"  since="1.4" >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductOptionEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/product-option-event.ts" sourceLine="26" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/product-option#productoption'>ProductOption</a> is added or updated.

## Signature

```TypeScript
class ProductOptionEvent extends VendureEntityEvent<ProductOption, ProductOptionInputTypes> {
  constructor(ctx: RequestContext, entity: ProductOption, type: 'created' | 'updated' | 'deleted', input?: ProductOptionInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>, ProductOptionInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>, type: 'created' | 'updated' | 'deleted', input?: ProductOptionInputTypes) => ProductOptionEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductOptionGroupChangeEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/product-option-group-change-event.ts" sourceLine="15" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> is assigned or removed from a <a href='/typescript-api/entities/product#product'>Product</a>.

## Signature

```TypeScript
class ProductOptionGroupChangeEvent extends VendureEvent {
  constructor(ctx: RequestContext, product: Product, optionGroupId: ID, type: 'assigned' | 'removed')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, product: <a href='/typescript-api/entities/product#product'>Product</a>, optionGroupId: <a href='/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => ProductOptionGroupChangeEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductOptionGroupEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/product-option-group-event.ts" sourceLine="21" packageName="@vendure/core" since="1.4">}}

This event is fired whenever a <a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> is added or updated.

## Signature

```TypeScript
class ProductOptionGroupEvent extends VendureEntityEvent<
    ProductOptionGroup,
    ProductOptionGroupInputTypes
> {
  constructor(ctx: RequestContext, entity: ProductOptionGroup, type: 'created' | 'updated' | 'deleted', input?: ProductOptionGroupInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;     <a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>,     ProductOptionGroupInputTypes &#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>, type: 'created' | 'updated' | 'deleted', input?: ProductOptionGroupInputTypes) => ProductOptionGroupEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductVariantChannelEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/product-variant-channel-event.ts" sourceLine="14" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> is assigned or removed from a <a href='/typescript-api/entities/channel#channel'>Channel</a>.

## Signature

```TypeScript
class ProductVariantChannelEvent extends VendureEvent {
  constructor(ctx: RequestContext, productVariant: ProductVariant, channelId: ID, type: 'assigned' | 'removed')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => ProductVariantChannelEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductVariantEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/product-variant-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> is added, updated
or deleted.

## Signature

```TypeScript
class ProductVariantEvent extends VendureEntityEvent<ProductVariant[], ProductVariantInputTypes> {
  constructor(ctx: RequestContext, entity: ProductVariant[], type: 'created' | 'updated' | 'deleted', input?: ProductVariantInputTypes)
  variants: ProductVariant[]
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[], ProductVariantInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[], type: 'created' | 'updated' | 'deleted', input?: ProductVariantInputTypes) => ProductVariantEvent"  >}}

{{< member-description >}}{{< /member-description >}}

### variants

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]"  since="1.4" >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PromotionEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/promotion-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/promotion#promotion'>Promotion</a> is added, updated
or deleted.

## Signature

```TypeScript
class PromotionEvent extends VendureEntityEvent<Promotion, PromotionInputTypes> {
  constructor(ctx: RequestContext, entity: Promotion, type: 'created' | 'updated' | 'deleted', input?: PromotionInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>, PromotionInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>, type: 'created' | 'updated' | 'deleted', input?: PromotionInputTypes) => PromotionEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProvinceEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/province-event.ts" sourceLine="18" packageName="@vendure/core" since="2.0">}}

This event is fired whenever a <a href='/typescript-api/entities/province#province'>Province</a> is added, updated or deleted.

## Signature

```TypeScript
class ProvinceEvent extends VendureEntityEvent<Province, ProvinceInputTypes> {
  constructor(ctx: RequestContext, entity: Province, type: 'created' | 'updated' | 'deleted', input?: ProvinceInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/province#province'>Province</a>, ProvinceInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/province#province'>Province</a>, type: 'created' | 'updated' | 'deleted', input?: ProvinceInputTypes) => ProvinceEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# RefundStateTransitionEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/refund-state-transition-event.ts" sourceLine="14" packageName="@vendure/core">}}

This event is fired whenever a {@link Refund} transitions from one <a href='/typescript-api/payment/refund-state#refundstate'>RefundState</a> to another.

## Signature

```TypeScript
class RefundStateTransitionEvent extends VendureEvent {
  constructor(fromState: RefundState, toState: RefundState, ctx: RequestContext, refund: Refund, order: Order)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(fromState: <a href='/typescript-api/payment/refund-state#refundstate'>RefundState</a>, toState: <a href='/typescript-api/payment/refund-state#refundstate'>RefundState</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, refund: Refund, order: <a href='/typescript-api/entities/order#order'>Order</a>) => RefundStateTransitionEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# RoleChangeEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/role-change-event.ts" sourceLine="16" packageName="@vendure/core" since="1.4">}}

This event is fired whenever one <a href='/typescript-api/entities/role#role'>Role</a> is assigned or removed from a user.
The property `roleIds` only contains the removed or assigned role ids.

## Signature

```TypeScript
class RoleChangeEvent extends VendureEvent {
  constructor(ctx: RequestContext, admin: Administrator, roleIds: ID[], type: 'assigned' | 'removed')
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, admin: <a href='/typescript-api/entities/administrator#administrator'>Administrator</a>, roleIds: <a href='/typescript-api/common/id#id'>ID</a>[], type: 'assigned' | 'removed') => RoleChangeEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# RoleEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/role-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4">}}

This event is fired whenever one <a href='/typescript-api/entities/role#role'>Role</a> is added, updated or deleted.

## Signature

```TypeScript
class RoleEvent extends VendureEntityEvent<Role, RoleInputTypes> {
  constructor(ctx: RequestContext, entity: Role, type: 'created' | 'updated' | 'deleted', input?: RoleInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/role#role'>Role</a>, RoleInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/role#role'>Role</a>, type: 'created' | 'updated' | 'deleted', input?: RoleInputTypes) => RoleEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SearchEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/search-event.ts" sourceLine="18" packageName="@vendure/core" since="1.6.0">}}

This event is fired whenever a search query is executed.

## Signature

```TypeScript
class SearchEvent extends VendureEvent {
  constructor(ctx: RequestContext, input: ExtendedSearchInput)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ExtendedSearchInput) => SearchEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SellerEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/seller-event.ts" sourceLine="19" packageName="@vendure/core" since="2.0.1">}}

This event is fired whenever one <a href='/typescript-api/entities/seller#seller'>Seller</a> is added, updated or deleted.

## Signature

```TypeScript
class SellerEvent extends VendureEntityEvent<Seller, SellerInputTypes> {
  constructor(ctx: RequestContext, entity: Seller, type: 'created' | 'updated' | 'deleted', input?: SellerInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/seller#seller'>Seller</a>, SellerInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/seller#seller'>Seller</a>, type: 'created' | 'updated' | 'deleted', input?: SellerInputTypes) => SellerEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ShippingMethodEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/shipping-method-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a> is added, updated
or deleted.

## Signature

```TypeScript
class ShippingMethodEvent extends VendureEntityEvent<ShippingMethod, ShippingMethodInputTypes> {
  constructor(ctx: RequestContext, entity: ShippingMethod, type: 'created' | 'updated' | 'deleted', input?: ShippingMethodInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>, ShippingMethodInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>, type: 'created' | 'updated' | 'deleted', input?: ShippingMethodInputTypes) => ShippingMethodEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# StockMovementEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/stock-movement-event.ts" sourceLine="16" packageName="@vendure/core" since="1.1.0">}}

This event is fired whenever a <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a> entity is created, which occurs when the saleable
stock level of a ProductVariant is altered due to things like sales, manual adjustments, and cancellations.

## Signature

```TypeScript
class StockMovementEvent extends VendureEvent {
  public readonly public readonly type: StockMovementType;
  constructor(ctx: RequestContext, stockMovements: StockMovement[])
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### type

{{< member-info kind="property" type="StockMovementType"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockMovements: <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>[]) => StockMovementEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# TaxCategoryEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/tax-category-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> is added, updated
or deleted.

## Signature

```TypeScript
class TaxCategoryEvent extends VendureEntityEvent<TaxCategory, TaxCategoryInputTypes> {
  constructor(ctx: RequestContext, entity: TaxCategory, type: 'created' | 'updated' | 'deleted', input?: TaxCategoryInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>, TaxCategoryInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>, type: 'created' | 'updated' | 'deleted', input?: TaxCategoryInputTypes) => TaxCategoryEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# TaxRateEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/tax-rate-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a> is added, updated
or deleted.

## Signature

```TypeScript
class TaxRateEvent extends VendureEntityEvent<TaxRate, TaxRateInputTypes> {
  constructor(ctx: RequestContext, entity: TaxRate, type: 'created' | 'updated' | 'deleted', input?: TaxRateInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>, TaxRateInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>, type: 'created' | 'updated' | 'deleted', input?: TaxRateInputTypes) => TaxRateEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# TaxRateModificationEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/tax-rate-modification-event.ts" sourceLine="13" packageName="@vendure/core">}}

This event is fired whenever a TaxRate is changed

## Signature

```TypeScript
class TaxRateModificationEvent extends VendureEvent {
  constructor(ctx: RequestContext, taxRate: TaxRate)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, taxRate: <a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>) => TaxRateModificationEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ZoneEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/zone-event.ts" sourceLine="18" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/zone#zone'>Zone</a> is added, updated
or deleted.

## Signature

```TypeScript
class ZoneEvent extends VendureEntityEvent<Zone, ZoneInputTypes> {
  constructor(ctx: RequestContext, entity: Zone, type: 'created' | 'updated' | 'deleted', input?: ZoneInputTypes)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>, ZoneInputTypes&#62;


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/zone#zone'>Zone</a>, type: 'created' | 'updated' | 'deleted', input?: ZoneInputTypes) => ZoneEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ZoneMembersEvent

{{< generation-info sourceFile="packages/core/src/event-bus/events/zone-members-event.ts" sourceLine="15" packageName="@vendure/core">}}

This event is fired whenever a <a href='/typescript-api/entities/zone#zone'>Zone</a> gets <a href='/typescript-api/entities/country#country'>Country</a> members assigned or removed
The `entity` property contains the zone with the already updated member field.

## Signature

```TypeScript
class ZoneMembersEvent extends VendureEvent {
  constructor(ctx: RequestContext, entity: Zone, type: 'assigned' | 'removed', memberIds: ID[])
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### constructor

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/typescript-api/entities/zone#zone'>Zone</a>, type: 'assigned' | 'removed', memberIds: <a href='/typescript-api/common/id#id'>ID</a>[]) => ZoneMembersEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
