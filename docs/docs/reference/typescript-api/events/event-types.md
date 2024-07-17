---
title: "Event Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AccountRegistrationEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/account-registration-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired when a new user registers an account, either as a stand-alone signup or after
placing an order.

```ts title="Signature"
class AccountRegistrationEvent extends VendureEvent {
    constructor(ctx: RequestContext, user: User)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => AccountRegistrationEvent`}   />




</div>


## AccountVerifiedEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/account-verified-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired when a users email address successfully gets verified after
the `verifyCustomerAccount` mutation was executed.

```ts title="Signature"
class AccountVerifiedEvent extends VendureEvent {
    constructor(ctx: RequestContext, customer: Customer)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customer: <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>) => AccountVerifiedEvent`}   />




</div>


## AdministratorEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/administrator-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a> is added, updated or deleted.

```ts title="Signature"
class AdministratorEvent extends VendureEntityEvent<Administrator, AdministratorInputTypes> {
    constructor(ctx: RequestContext, entity: Administrator, type: 'created' | 'updated' | 'deleted', input?: AdministratorInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>, AdministratorInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>, type: 'created' | 'updated' | 'deleted', input?: AdministratorInputTypes) => AdministratorEvent`}   />




</div>


## AssetChannelEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/asset-channel-event.ts" sourceLine="15" packageName="@vendure/core" />

This event is fired whenever an <a href='/reference/typescript-api/entities/asset#asset'>Asset</a> is assigned or removed
From a channel.

```ts title="Signature"
class AssetChannelEvent extends VendureEvent {
    constructor(ctx: RequestContext, asset: Asset, channelId: ID, type: 'assigned' | 'removed')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, asset: <a href='/reference/typescript-api/entities/asset#asset'>Asset</a>, channelId: <a href='/reference/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => AssetChannelEvent`}   />




</div>


## AssetEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/asset-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/asset#asset'>Asset</a> is added, updated or deleted.

```ts title="Signature"
class AssetEvent extends VendureEntityEvent<Asset, AssetInputTypes> {
    constructor(ctx: RequestContext, entity: Asset, type: 'created' | 'updated' | 'deleted', input?: AssetInputTypes)
    asset: Asset
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>, AssetInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/asset#asset'>Asset</a>, type: 'created' | 'updated' | 'deleted', input?: AssetInputTypes) => AssetEvent`}   />


### asset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>`}  since="1.4"  />




</div>


## AttemptedLoginEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/attempted-login-event.ts" sourceLine="14" packageName="@vendure/core" />

This event is fired when an attempt is made to log in via the shop or admin API `login` mutation.
The `strategy` represents the name of the AuthenticationStrategy used in the login attempt.
If the "native" strategy is used, the additional `identifier` property will be available.

```ts title="Signature"
class AttemptedLoginEvent extends VendureEvent {
    constructor(ctx: RequestContext, strategy: string, identifier?: string)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, strategy: string, identifier?: string) => AttemptedLoginEvent`}   />




</div>


## ChangeChannelEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/change-channel-event.ts" sourceLine="17" packageName="@vendure/core" since="1.4" />

This event is fired whenever an <a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a> entity is assigned or removed
from a channel. The entity property contains the value before updating the channels.

```ts title="Signature"
class ChangeChannelEvent<T extends ChannelAware & VendureEntity> extends VendureEvent {
    constructor(ctx: RequestContext, entity: T, channelIds: ID[], type: 'assigned' | 'removed', entityType?: Type<T>)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T, channelIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[], type: 'assigned' | 'removed', entityType?: Type&#60;T&#62;) => ChangeChannelEvent`}   />




</div>


## ChannelEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/channel-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/channel#channel'>Channel</a> is added, updated or deleted.

```ts title="Signature"
class ChannelEvent extends VendureEntityEvent<Channel, ChannelInputTypes> {
    constructor(ctx: RequestContext, entity: Channel, type: 'created' | 'updated' | 'deleted', input?: ChannelInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>, ChannelInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>, type: 'created' | 'updated' | 'deleted', input?: ChannelInputTypes) => ChannelEvent`}   />




</div>


## CollectionEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/collection-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/collection#collection'>Collection</a> is added, updated or deleted.

```ts title="Signature"
class CollectionEvent extends VendureEntityEvent<Collection, CollectionInputTypes> {
    constructor(ctx: RequestContext, entity: Collection, type: 'created' | 'updated' | 'deleted', input?: CollectionInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>, CollectionInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/collection#collection'>Collection</a>, type: 'created' | 'updated' | 'deleted', input?: CollectionInputTypes) => CollectionEvent`}   />




</div>


## CollectionModificationEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/collection-modification-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a Collection is modified in some way. The `productVariantIds`
argument is an array of ids of all ProductVariants which:

1. were part of this collection prior to modification and are no longer
2. are now part of this collection after modification but were not before

```ts title="Signature"
class CollectionModificationEvent extends VendureEvent {
    constructor(ctx: RequestContext, collection: Collection, productVariantIds: ID[])
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collection: <a href='/reference/typescript-api/entities/collection#collection'>Collection</a>, productVariantIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => CollectionModificationEvent`}   />




</div>


## CountryEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/country-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/country#country'>Country</a> is added, updated or deleted.

```ts title="Signature"
class CountryEvent extends VendureEntityEvent<Country, CountryInputTypes> {
    constructor(ctx: RequestContext, entity: Country, type: 'created' | 'updated' | 'deleted', input?: CountryInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>, CountryInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/country#country'>Country</a>, type: 'created' | 'updated' | 'deleted', input?: CountryInputTypes) => CountryEvent`}   />




</div>


## CouponCodeEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/coupon-code-event.ts" sourceLine="15" packageName="@vendure/core" since="1.4" />

This event is fired whenever an coupon code of an active <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>
is assigned or removed to an <a href='/reference/typescript-api/entities/order#order'>Order</a>.

```ts title="Signature"
class CouponCodeEvent extends VendureEvent {
    constructor(ctx: RequestContext, couponCode: string, orderId: ID, type: 'assigned' | 'removed')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, couponCode: string, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => CouponCodeEvent`}   />




</div>


## CustomerAddressEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/customer-address-event.ts" sourceLine="22" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/address#address'>Address</a> is added, updated
or deleted.

```ts title="Signature"
class CustomerAddressEvent extends VendureEntityEvent<Address, CustomerAddressInputTypes> {
    constructor(ctx: RequestContext, entity: Address, type: 'created' | 'updated' | 'deleted', input?: CustomerAddressInputTypes)
    address: Address
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/address#address'>Address</a>, CustomerAddressInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/address#address'>Address</a>, type: 'created' | 'updated' | 'deleted', input?: CustomerAddressInputTypes) => CustomerAddressEvent`}   />


### address

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/address#address'>Address</a>`}   />




</div>


## CustomerEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/customer-event.ts" sourceLine="22" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/customer#customer'>Customer</a> is added, updated
or deleted.

```ts title="Signature"
class CustomerEvent extends VendureEntityEvent<Customer, CustomerInputTypes> {
    constructor(ctx: RequestContext, entity: Customer, type: 'created' | 'updated' | 'deleted', input?: CustomerInputTypes)
    customer: Customer
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>, CustomerInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>, type: 'created' | 'updated' | 'deleted', input?: CustomerInputTypes) => CustomerEvent`}   />


### customer

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>`}  since="1.4"  />




</div>


## CustomerGroupChangeEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/customer-group-change-event.ts" sourceLine="15" packageName="@vendure/core" since="1.4" />

This event is fired whenever one or more <a href='/reference/typescript-api/entities/customer#customer'>Customer</a> is assigned to or removed from a
<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>.

```ts title="Signature"
class CustomerGroupChangeEvent extends VendureEvent {
    constructor(ctx: RequestContext, customers: Customer[], customGroup: CustomerGroup, type: 'assigned' | 'removed')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customers: <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>[], customGroup: <a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>, type: 'assigned' | 'removed') => CustomerGroupChangeEvent`}   />




</div>


## CustomerGroupEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/customer-group-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> is added, updated or deleted.

```ts title="Signature"
class CustomerGroupEvent extends VendureEntityEvent<CustomerGroup, CustomerGroupInputTypes> {
    constructor(ctx: RequestContext, entity: CustomerGroup, type: 'created' | 'updated' | 'deleted', input?: CustomerGroupInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>, CustomerGroupInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>, type: 'created' | 'updated' | 'deleted', input?: CustomerGroupInputTypes) => CustomerGroupEvent`}   />




</div>


## FacetEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/facet-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/facet#facet'>Facet</a> is added, updated or deleted.

```ts title="Signature"
class FacetEvent extends VendureEntityEvent<Facet, FacetInputTypes> {
    constructor(ctx: RequestContext, entity: Facet, type: 'created' | 'updated' | 'deleted', input?: FacetInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>, FacetInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/facet#facet'>Facet</a>, type: 'created' | 'updated' | 'deleted', input?: FacetInputTypes) => FacetEvent`}   />




</div>


## FacetValueEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/facet-value-event.ts" sourceLine="26" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a> is added, updated or deleted.

```ts title="Signature"
class FacetValueEvent extends VendureEntityEvent<FacetValue, FacetValueInputTypes> {
    constructor(ctx: RequestContext, entity: FacetValue, type: 'created' | 'updated' | 'deleted', input?: FacetValueInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>, FacetValueInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>, type: 'created' | 'updated' | 'deleted', input?: FacetValueInputTypes) => FacetValueEvent`}   />




</div>


## FulfillmentEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/fulfillment-event.ts" sourceLine="27" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> is added. The type is always `created`.

```ts title="Signature"
class FulfillmentEvent extends VendureEntityEvent<Fulfillment, CreateFulfillmentInput> {
    constructor(ctx: RequestContext, entity: Fulfillment, input?: CreateFulfillmentInput)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>, CreateFulfillmentInput&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>, input?: CreateFulfillmentInput) => FulfillmentEvent`}   />




</div>


## FulfillmentStateTransitionEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/fulfillment-state-transition-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired whenever an <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> transitions from one <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a> to another.

```ts title="Signature"
class FulfillmentStateTransitionEvent extends VendureEvent {
    constructor(fromState: FulfillmentState, toState: FulfillmentState, ctx: RequestContext, fulfillment: Fulfillment)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(fromState: <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>, toState: <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fulfillment: <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>) => FulfillmentStateTransitionEvent`}   />




</div>


## GlobalSettingsEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/global-settings-event.ts" sourceLine="16" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/global-settings#globalsettings'>GlobalSettings</a> is added. The type is always `updated`, because it's
only created once and never deleted.

```ts title="Signature"
class GlobalSettingsEvent extends VendureEntityEvent<GlobalSettings, UpdateGlobalSettingsInput> {
    constructor(ctx: RequestContext, entity: GlobalSettings, input?: UpdateGlobalSettingsInput)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/global-settings#globalsettings'>GlobalSettings</a>, UpdateGlobalSettingsInput&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/global-settings#globalsettings'>GlobalSettings</a>, input?: UpdateGlobalSettingsInput) => GlobalSettingsEvent`}   />




</div>


## HistoryEntryEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/history-entry-event.ts" sourceLine="23" packageName="@vendure/core" since="1.4" />

This event is fired whenever one <a href='/reference/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a> is added, updated or deleted.

```ts title="Signature"
class HistoryEntryEvent extends VendureEntityEvent<HistoryEntry, HistoryInput> {
    public readonly historyType: 'order' | 'customer' | string;
    constructor(ctx: RequestContext, entity: HistoryEntry, type: 'created' | 'updated' | 'deleted', historyType: 'order' | 'customer' | string, input?: HistoryInput)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>, HistoryInput&#62;</code>



<div className="members-wrapper">

### historyType

<MemberInfo kind="property" type={`'order' | 'customer' | string`}   />


### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>, type: 'created' | 'updated' | 'deleted', historyType: 'order' | 'customer' | string, input?: HistoryInput) => HistoryEntryEvent`}   />




</div>


## IdentifierChangeEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/identifier-change-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired when a registered user successfully changes the identifier (ie email address)
associated with their account.

```ts title="Signature"
class IdentifierChangeEvent extends VendureEvent {
    constructor(ctx: RequestContext, user: User, oldIdentifier: string)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>, oldIdentifier: string) => IdentifierChangeEvent`}   />




</div>


## IdentifierChangeRequestEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/identifier-change-request-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired when a registered user requests to update the identifier (ie email address)
associated with the account.

```ts title="Signature"
class IdentifierChangeRequestEvent extends VendureEvent {
    constructor(ctx: RequestContext, user: User)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => IdentifierChangeRequestEvent`}   />




</div>


## InitializerEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/initializer-event.ts" sourceLine="11" packageName="@vendure/core" since="1.7.0" />

This event is fired when vendure finished initializing its services inside the <a href='/reference/typescript-api/services/initializer-service#initializerservice'>InitializerService</a>

```ts title="Signature"
class InitializerEvent extends VendureEvent {
    constructor()
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`() => InitializerEvent`}   />




</div>


## LoginEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/login-event.ts" sourceLine="12" packageName="@vendure/core" />

This event is fired when a user successfully logs in via the shop or admin API `login` mutation.

```ts title="Signature"
class LoginEvent extends VendureEvent {
    constructor(ctx: RequestContext, user: User)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => LoginEvent`}   />




</div>


## LogoutEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/logout-event.ts" sourceLine="12" packageName="@vendure/core" />

This event is fired when a user logs out via the shop or admin API `logout` mutation.

```ts title="Signature"
class LogoutEvent extends VendureEvent {
    constructor(ctx: RequestContext)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => LogoutEvent`}   />




</div>


## OrderEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/order-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired whenever an <a href='/reference/typescript-api/entities/order#order'>Order</a> is added, updated
or deleted.

```ts title="Signature"
class OrderEvent extends VendureEvent {
    constructor(ctx: RequestContext, order: Order, type: 'created' | 'updated' | 'deleted')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, type: 'created' | 'updated' | 'deleted') => OrderEvent`}   />




</div>


## OrderLineEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/order-line-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired whenever an <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a> is added, updated
or deleted.

```ts title="Signature"
class OrderLineEvent extends VendureEvent {
    constructor(ctx: RequestContext, order: Order, orderLine: OrderLine, type: 'created' | 'updated' | 'deleted' | 'cancelled')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, type: 'created' | 'updated' | 'deleted' | 'cancelled') => OrderLineEvent`}   />




</div>


## OrderPlacedEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/order-placed-event.ts" sourceLine="17" packageName="@vendure/core" />

This event is fired whenever an <a href='/reference/typescript-api/entities/order#order'>Order</a> is set as "placed", which by default is
when it transitions from 'ArrangingPayment' to either 'PaymentAuthorized' or 'PaymentSettled'.

Note that the exact point that it is set as "placed" can be configured according to the
<a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>.

```ts title="Signature"
class OrderPlacedEvent extends VendureEvent {
    constructor(fromState: OrderState, toState: OrderState, ctx: RequestContext, order: Order)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(fromState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => OrderPlacedEvent`}   />




</div>


## OrderStateTransitionEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/order-state-transition-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired whenever an <a href='/reference/typescript-api/entities/order#order'>Order</a> transitions from one <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a> to another.

```ts title="Signature"
class OrderStateTransitionEvent extends VendureEvent {
    constructor(fromState: OrderState, toState: OrderState, ctx: RequestContext, order: Order)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(fromState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, toState: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => OrderStateTransitionEvent`}   />




</div>


## PasswordResetEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/password-reset-event.ts" sourceLine="12" packageName="@vendure/core" />

This event is fired when a Customer requests a password reset email.

```ts title="Signature"
class PasswordResetEvent extends VendureEvent {
    constructor(ctx: RequestContext, user: User)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => PasswordResetEvent`}   />




</div>


## PasswordResetVerifiedEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/password-reset-verified-event.ts" sourceLine="13" packageName="@vendure/core" since="1.4" />

This event is fired when a password reset is executed with a verified token.

```ts title="Signature"
class PasswordResetVerifiedEvent extends VendureEvent {
    constructor(ctx: RequestContext, user: User)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>) => PasswordResetVerifiedEvent`}   />




</div>


## PaymentMethodEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/payment-method-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a> is added, updated
or deleted.

```ts title="Signature"
class PaymentMethodEvent extends VendureEntityEvent<PaymentMethod, PaymentMethodInputTypes> {
    constructor(ctx: RequestContext, entity: PaymentMethod, type: 'created' | 'updated' | 'deleted', input?: PaymentMethodInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>, PaymentMethodInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>, type: 'created' | 'updated' | 'deleted', input?: PaymentMethodInputTypes) => PaymentMethodEvent`}   />




</div>


## PaymentStateTransitionEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/payment-state-transition-event.ts" sourceLine="15" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/payment#payment'>Payment</a> transitions from one <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> to another, e.g.
a Payment is authorized by the payment provider.

```ts title="Signature"
class PaymentStateTransitionEvent extends VendureEvent {
    constructor(fromState: PaymentState, toState: PaymentState, ctx: RequestContext, payment: Payment, order: Order)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(fromState: <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, toState: <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, payment: <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => PaymentStateTransitionEvent`}   />




</div>


## ProductChannelEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-channel-event.ts" sourceLine="15" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product#product'>Product</a> is added, updated
or deleted.

```ts title="Signature"
class ProductChannelEvent extends VendureEvent {
    constructor(ctx: RequestContext, product: Product, channelId: ID, type: 'assigned' | 'removed')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, product: <a href='/reference/typescript-api/entities/product#product'>Product</a>, channelId: <a href='/reference/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => ProductChannelEvent`}   />




</div>


## ProductEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product#product'>Product</a> is added, updated
or deleted.

```ts title="Signature"
class ProductEvent extends VendureEntityEvent<Product, ProductInputTypes> {
    constructor(ctx: RequestContext, entity: Product, type: 'created' | 'updated' | 'deleted', input?: ProductInputTypes)
    product: Product
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>, ProductInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/product#product'>Product</a>, type: 'created' | 'updated' | 'deleted', input?: ProductInputTypes) => ProductEvent`}   />


### product

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product#product'>Product</a>`}  since="1.4"  />




</div>


## ProductOptionEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-option-event.ts" sourceLine="26" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a> is added or updated.

```ts title="Signature"
class ProductOptionEvent extends VendureEntityEvent<ProductOption, ProductOptionInputTypes> {
    constructor(ctx: RequestContext, entity: ProductOption, type: 'created' | 'updated' | 'deleted', input?: ProductOptionInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>, ProductOptionInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>, type: 'created' | 'updated' | 'deleted', input?: ProductOptionInputTypes) => ProductOptionEvent`}   />




</div>


## ProductOptionGroupChangeEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-option-group-change-event.ts" sourceLine="15" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> is assigned or removed from a <a href='/reference/typescript-api/entities/product#product'>Product</a>.

```ts title="Signature"
class ProductOptionGroupChangeEvent extends VendureEvent {
    constructor(ctx: RequestContext, product: Product, optionGroupId: ID, type: 'assigned' | 'removed')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, product: <a href='/reference/typescript-api/entities/product#product'>Product</a>, optionGroupId: <a href='/reference/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => ProductOptionGroupChangeEvent`}   />




</div>


## ProductOptionGroupEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-option-group-event.ts" sourceLine="24" packageName="@vendure/core" since="1.4" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> is added or updated.

```ts title="Signature"
class ProductOptionGroupEvent extends VendureEntityEvent<
    ProductOptionGroup,
    ProductOptionGroupInputTypes
> {
    constructor(ctx: RequestContext, entity: ProductOptionGroup, type: 'created' | 'updated' | 'deleted', input?: ProductOptionGroupInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;     <a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>,     ProductOptionGroupInputTypes &#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>, type: 'created' | 'updated' | 'deleted', input?: ProductOptionGroupInputTypes) => ProductOptionGroupEvent`}   />




</div>


## ProductVariantChannelEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-variant-channel-event.ts" sourceLine="14" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> is assigned or removed from a <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>.

```ts title="Signature"
class ProductVariantChannelEvent extends VendureEvent {
    constructor(ctx: RequestContext, productVariant: ProductVariant, channelId: ID, type: 'assigned' | 'removed')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, channelId: <a href='/reference/typescript-api/common/id#id'>ID</a>, type: 'assigned' | 'removed') => ProductVariantChannelEvent`}   />




</div>


## ProductVariantEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-variant-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> is added, updated
or deleted.

```ts title="Signature"
class ProductVariantEvent extends VendureEntityEvent<ProductVariant[], ProductVariantInputTypes> {
    constructor(ctx: RequestContext, entity: ProductVariant[], type: 'created' | 'updated' | 'deleted', input?: ProductVariantInputTypes)
    variants: ProductVariant[]
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[], ProductVariantInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[], type: 'created' | 'updated' | 'deleted', input?: ProductVariantInputTypes) => ProductVariantEvent`}   />


### variants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}  since="1.4"  />




</div>


## ProductVariantPriceEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/product-variant-price-event.ts" sourceLine="17" packageName="@vendure/core" since="2.2.0" />

This event is fired whenever a <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> is added, updated or deleted.

```ts title="Signature"
class ProductVariantPriceEvent extends VendureEntityEvent<
    ProductVariantPrice[],
    ProductVariantInputTypes
> {
    constructor(ctx: RequestContext, entity: ProductVariantPrice[], type: 'created' | 'updated' | 'deleted', input?: ProductVariantInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;     <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[],     ProductVariantInputTypes &#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[], type: 'created' | 'updated' | 'deleted', input?: ProductVariantInputTypes) => ProductVariantPriceEvent`}   />




</div>


## PromotionEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/promotion-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a> is added, updated
or deleted.

```ts title="Signature"
class PromotionEvent extends VendureEntityEvent<Promotion, PromotionInputTypes> {
    constructor(ctx: RequestContext, entity: Promotion, type: 'created' | 'updated' | 'deleted', input?: PromotionInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>, PromotionInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>, type: 'created' | 'updated' | 'deleted', input?: PromotionInputTypes) => PromotionEvent`}   />




</div>


## ProvinceEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/province-event.ts" sourceLine="18" packageName="@vendure/core" since="2.0" />

This event is fired whenever a <a href='/reference/typescript-api/entities/province#province'>Province</a> is added, updated or deleted.

```ts title="Signature"
class ProvinceEvent extends VendureEntityEvent<Province, ProvinceInputTypes> {
    constructor(ctx: RequestContext, entity: Province, type: 'created' | 'updated' | 'deleted', input?: ProvinceInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>, ProvinceInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/province#province'>Province</a>, type: 'created' | 'updated' | 'deleted', input?: ProvinceInputTypes) => ProvinceEvent`}   />




</div>


## RefundEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/refund-event.ts" sourceLine="12" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/refund#refund'>Refund</a> is created

```ts title="Signature"
class RefundEvent extends VendureEvent {
    constructor(ctx: RequestContext, order: Order, refund: Refund, type: 'created')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, refund: <a href='/reference/typescript-api/entities/refund#refund'>Refund</a>, type: 'created') => RefundEvent`}   />




</div>


## RefundStateTransitionEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/refund-state-transition-event.ts" sourceLine="14" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/refund#refund'>Refund</a> transitions from one <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a> to another.

```ts title="Signature"
class RefundStateTransitionEvent extends VendureEvent {
    constructor(fromState: RefundState, toState: RefundState, ctx: RequestContext, refund: Refund, order: Order)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(fromState: <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>, toState: <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, refund: <a href='/reference/typescript-api/entities/refund#refund'>Refund</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => RefundStateTransitionEvent`}   />




</div>


## RoleChangeEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/role-change-event.ts" sourceLine="16" packageName="@vendure/core" since="1.4" />

This event is fired whenever one <a href='/reference/typescript-api/entities/role#role'>Role</a> is assigned or removed from a user.
The property `roleIds` only contains the removed or assigned role ids.

```ts title="Signature"
class RoleChangeEvent extends VendureEvent {
    constructor(ctx: RequestContext, admin: Administrator, roleIds: ID[], type: 'assigned' | 'removed')
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, admin: <a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>, roleIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[], type: 'assigned' | 'removed') => RoleChangeEvent`}   />




</div>


## RoleEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/role-event.ts" sourceLine="18" packageName="@vendure/core" since="1.4" />

This event is fired whenever one <a href='/reference/typescript-api/entities/role#role'>Role</a> is added, updated or deleted.

```ts title="Signature"
class RoleEvent extends VendureEntityEvent<Role, RoleInputTypes> {
    constructor(ctx: RequestContext, entity: Role, type: 'created' | 'updated' | 'deleted', input?: RoleInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/role#role'>Role</a>, RoleInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/role#role'>Role</a>, type: 'created' | 'updated' | 'deleted', input?: RoleInputTypes) => RoleEvent`}   />




</div>


## SearchEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/search-event.ts" sourceLine="18" packageName="@vendure/core" since="1.6.0" />

This event is fired whenever a search query is executed.

```ts title="Signature"
class SearchEvent extends VendureEvent {
    constructor(ctx: RequestContext, input: ExtendedSearchInput)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ExtendedSearchInput) => SearchEvent`}   />




</div>


## SellerEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/seller-event.ts" sourceLine="19" packageName="@vendure/core" since="2.0.1" />

This event is fired whenever one <a href='/reference/typescript-api/entities/seller#seller'>Seller</a> is added, updated or deleted.

```ts title="Signature"
class SellerEvent extends VendureEntityEvent<Seller, SellerInputTypes> {
    constructor(ctx: RequestContext, entity: Seller, type: 'created' | 'updated' | 'deleted', input?: SellerInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/seller#seller'>Seller</a>, SellerInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/seller#seller'>Seller</a>, type: 'created' | 'updated' | 'deleted', input?: SellerInputTypes) => SellerEvent`}   />




</div>


## ShippingMethodEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/shipping-method-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a> is added, updated
or deleted.

```ts title="Signature"
class ShippingMethodEvent extends VendureEntityEvent<ShippingMethod, ShippingMethodInputTypes> {
    constructor(ctx: RequestContext, entity: ShippingMethod, type: 'created' | 'updated' | 'deleted', input?: ShippingMethodInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>, ShippingMethodInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>, type: 'created' | 'updated' | 'deleted', input?: ShippingMethodInputTypes) => ShippingMethodEvent`}   />




</div>


## StockMovementEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/stock-movement-event.ts" sourceLine="16" packageName="@vendure/core" since="1.1.0" />

This event is fired whenever a <a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a> entity is created, which occurs when the saleable
stock level of a ProductVariant is altered due to things like sales, manual adjustments, and cancellations.

```ts title="Signature"
class StockMovementEvent extends VendureEvent {
    public readonly type: StockMovementType;
    constructor(ctx: RequestContext, stockMovements: StockMovement[])
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`StockMovementType`}   />


### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockMovements: <a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>[]) => StockMovementEvent`}   />




</div>


## TaxCategoryEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/tax-category-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> is added, updated
or deleted.

```ts title="Signature"
class TaxCategoryEvent extends VendureEntityEvent<TaxCategory, TaxCategoryInputTypes> {
    constructor(ctx: RequestContext, entity: TaxCategory, type: 'created' | 'updated' | 'deleted', input?: TaxCategoryInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>, TaxCategoryInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>, type: 'created' | 'updated' | 'deleted', input?: TaxCategoryInputTypes) => TaxCategoryEvent`}   />




</div>


## TaxRateEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/tax-rate-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a> is added, updated
or deleted.

```ts title="Signature"
class TaxRateEvent extends VendureEntityEvent<TaxRate, TaxRateInputTypes> {
    constructor(ctx: RequestContext, entity: TaxRate, type: 'created' | 'updated' | 'deleted', input?: TaxRateInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>, TaxRateInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>, type: 'created' | 'updated' | 'deleted', input?: TaxRateInputTypes) => TaxRateEvent`}   />




</div>


## TaxRateModificationEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/tax-rate-modification-event.ts" sourceLine="13" packageName="@vendure/core" />

This event is fired whenever a TaxRate is changed

```ts title="Signature"
class TaxRateModificationEvent extends VendureEvent {
    constructor(ctx: RequestContext, taxRate: TaxRate)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, taxRate: <a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>) => TaxRateModificationEvent`}   />




</div>


## ZoneEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/zone-event.ts" sourceLine="18" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/zone#zone'>Zone</a> is added, updated
or deleted.

```ts title="Signature"
class ZoneEvent extends VendureEntityEvent<Zone, ZoneInputTypes> {
    constructor(ctx: RequestContext, entity: Zone, type: 'created' | 'updated' | 'deleted', input?: ZoneInputTypes)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-entity-event#vendureentityevent'>VendureEntityEvent</a>&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>, ZoneInputTypes&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>, type: 'created' | 'updated' | 'deleted', input?: ZoneInputTypes) => ZoneEvent`}   />




</div>


## ZoneMembersEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/events/zone-members-event.ts" sourceLine="15" packageName="@vendure/core" />

This event is fired whenever a <a href='/reference/typescript-api/entities/zone#zone'>Zone</a> gets <a href='/reference/typescript-api/entities/country#country'>Country</a> members assigned or removed
The `entity` property contains the zone with the already updated member field.

```ts title="Signature"
class ZoneMembersEvent extends VendureEvent {
    constructor(ctx: RequestContext, entity: Zone, type: 'assigned' | 'removed', memberIds: ID[])
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>, type: 'assigned' | 'removed', memberIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => ZoneMembersEvent`}   />




</div>
