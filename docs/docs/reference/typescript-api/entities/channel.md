---
title: "Channel"
weight: 10
date: 2023-07-20T13:56:15.086Z
showtoc: true
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
  @Column({ unique: true }) @Column({ unique: true })
    code: string;
  @Column({ unique: true }) @Column({ unique: true })
    token: string;
  @Column({ default: '', nullable: true }) @Column({ default: '', nullable: true })
    description: string;
  @Index() @ManyToOne(type => Seller) @Index()
    @ManyToOne(type => Seller)
    seller?: Seller;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    sellerId?: ID;
  @Column('varchar') @Column('varchar') defaultLanguageCode: LanguageCode;
  @Column({ type: 'simple-array', nullable: true }) @Column({ type: 'simple-array', nullable: true })
    availableLanguageCodes: LanguageCode[];
  @Index() @ManyToOne(type => Zone) @Index()
    @ManyToOne(type => Zone)
    defaultTaxZone: Zone;
  @Index() @ManyToOne(type => Zone) @Index()
    @ManyToOne(type => Zone)
    defaultShippingZone: Zone;
  @Column('varchar') @Column('varchar')
    defaultCurrencyCode: CurrencyCode;
  @Column({ type: 'simple-array', nullable: true }) @Column({ type: 'simple-array', nullable: true })
    availableCurrencyCodes: CurrencyCode[];
  @Column({ default: true }) @Column({ default: true })
    trackInventory: boolean;
  @Column({ default: 0 }) @Column({ default: 0 })
    outOfStockThreshold: number;
  @Column(type => CustomChannelFields) @Column(type => CustomChannelFields)
    customFields: CustomChannelFields;
  @Column() @Column() pricesIncludeTax: boolean;
}
```
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;) => Channel"   />


### code

<MemberInfo kind="property" type="string"   />


### token

<MemberInfo kind="property" type="string"   />


### description

<MemberInfo kind="property" type="string"   />


### seller

<MemberInfo kind="property" type="<a href='/typescript-api/entities/seller#seller'>Seller</a>"   />


### sellerId

<MemberInfo kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"   />


### defaultLanguageCode

<MemberInfo kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>"   />


### availableLanguageCodes

<MemberInfo kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>[]"   />


### defaultTaxZone

<MemberInfo kind="property" type="<a href='/typescript-api/entities/zone#zone'>Zone</a>"   />


### defaultShippingZone

<MemberInfo kind="property" type="<a href='/typescript-api/entities/zone#zone'>Zone</a>"   />


### defaultCurrencyCode

<MemberInfo kind="property" type="<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>"   />


### availableCurrencyCodes

<MemberInfo kind="property" type="<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>[]"   />


### trackInventory

<MemberInfo kind="property" type="boolean"   />

Specifies the default value for inventory tracking for ProductVariants.
Can be overridden per ProductVariant, but this value determines the default
if not otherwise specified.
### outOfStockThreshold

<MemberInfo kind="property" type="number"   />

Specifies the value of stockOnHand at which a given ProductVariant is considered
out of stock.
### customFields

<MemberInfo kind="property" type="CustomChannelFields"   />


### pricesIncludeTax

<MemberInfo kind="property" type="boolean"   />


