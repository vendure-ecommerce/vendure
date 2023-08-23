---
title: "Channel"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Channel

<GenerationInfo sourceFile="packages/core/src/entity/channel/channel.entity.ts" sourceLine="31" packageName="@vendure/core" />

A Channel represents a distinct sales channel and configures defaults for that
channel.

* Set a channel-specific currency, language, tax and shipping defaults
* Assign only specific Products to the Channel (with Channel-specific prices)
* Create Administrator roles limited to the Channel
* Assign only specific StockLocations, Assets, Facets, Collections, Promotions, ShippingMethods & PaymentMethods to the Channel
* Have Orders and Customers associated with specific Channels.

In Vendure, Channels have a number of different uses, such as:

* Multi-region stores, where there is a distinct website for each territory with its own available inventory, pricing, tax and shipping rules.
* Creating distinct rules and inventory for different sales channels such as Amazon.
* Specialized stores offering a subset of the main inventory.
* Implementing multi-vendor marketplace applications.

```ts title="Signature"
class Channel extends VendureEntity {
    constructor(input?: DeepPartial<Channel>)
    @Column({ unique: true })
    code: string;
    @Column({ unique: true })
    token: string;
    @Column({ default: '', nullable: true })
    description: string;
    @Index()
    @ManyToOne(type => Seller)
    seller?: Seller;
    @EntityId({ nullable: true })
    sellerId?: ID;
    @Column('varchar') defaultLanguageCode: LanguageCode;
    @Column({ type: 'simple-array', nullable: true })
    availableLanguageCodes: LanguageCode[];
    @Index()
    @ManyToOne(type => Zone)
    defaultTaxZone: Zone;
    @Index()
    @ManyToOne(type => Zone)
    defaultShippingZone: Zone;
    @Column('varchar')
    defaultCurrencyCode: CurrencyCode;
    @Column({ type: 'simple-array', nullable: true })
    availableCurrencyCodes: CurrencyCode[];
    @Column({ default: true })
    trackInventory: boolean;
    @Column({ default: 0 })
    outOfStockThreshold: number;
    @Column(type => CustomChannelFields)
    customFields: CustomChannelFields;
    @Column() pricesIncludeTax: boolean;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;) => Channel`}   />


### code

<MemberInfo kind="property" type={`string`}   />

The name of the Channel. For example "US Webstore" or "German Webstore".
### token

<MemberInfo kind="property" type={`string`}   />

A unique token (string) used to identify the Channel in the `vendure-token` header of the
GraphQL API requests.
### description

<MemberInfo kind="property" type={`string`}   />


### seller

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/seller#seller'>Seller</a>`}   />


### sellerId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### defaultLanguageCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>`}   />


### availableLanguageCodes

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]`}   />


### defaultTaxZone

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>`}   />


### defaultShippingZone

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>`}   />


### defaultCurrencyCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>`}   />


### availableCurrencyCodes

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>[]`}   />


### trackInventory

<MemberInfo kind="property" type={`boolean`}   />

Specifies the default value for inventory tracking for ProductVariants.
Can be overridden per ProductVariant, but this value determines the default
if not otherwise specified.
### outOfStockThreshold

<MemberInfo kind="property" type={`number`}   />

Specifies the value of stockOnHand at which a given ProductVariant is considered
out of stock.
### customFields

<MemberInfo kind="property" type={`CustomChannelFields`}   />


### pricesIncludeTax

<MemberInfo kind="property" type={`boolean`}   />




</div>
