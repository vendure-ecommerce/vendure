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

<GenerationInfo sourceFile="packages/core/src/entity/channel/channel.entity.ts" sourceLine="37" packageName="@vendure/core" />

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
    @ManyToOne(type => Seller, seller => seller.channels)
    seller?: Seller;
    @EntityId({ nullable: true })
    sellerId?: ID;
    @Column('varchar') defaultLanguageCode: LanguageCode;
    @Column({ type: 'simple-array', nullable: true })
    availableLanguageCodes: LanguageCode[];
    @Index()
    @ManyToOne(type => Zone, zone => zone.defaultTaxZoneChannels)
    defaultTaxZone: Zone;
    @Index()
    @ManyToOne(type => Zone, zone => zone.defaultShippingZoneChannels)
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
    @ManyToMany(type => Product, product => product.channels, { onDelete: 'CASCADE' })
    products: Product[];
    @ManyToMany(type => ProductVariant, productVariant => productVariant.channels, { onDelete: 'CASCADE' })
    productVariants: ProductVariant[];
    @ManyToMany(type => FacetValue, facetValue => facetValue.channels, { onDelete: 'CASCADE' })
    facetValues: FacetValue[];
    @ManyToMany(type => Facet, facet => facet.channels, { onDelete: 'CASCADE' })
    facets: Facet[];
    @ManyToMany(type => Collection, collection => collection.channels, { onDelete: 'CASCADE' })
    collections: Collection[];
    @ManyToMany(type => Promotion, promotion => promotion.channels, { onDelete: 'CASCADE' })
    promotions: Promotion[];
    @ManyToMany(type => PaymentMethod, paymentMethod => paymentMethod.channels, { onDelete: 'CASCADE' })
    paymentMethods: PaymentMethod[];
    @ManyToMany(type => ShippingMethod, shippingMethod => shippingMethod.channels, { onDelete: 'CASCADE' })
    shippingMethods: ShippingMethod[];
    @ManyToMany(type => Customer, customer => customer.channels, { onDelete: 'CASCADE' })
    customers: Customer[];
    @ManyToMany(type => Role, role => role.channels, { onDelete: 'CASCADE' })
    roles: Role[];
    @ManyToMany(type => StockLocation, stockLocation => stockLocation.channels, { onDelete: 'CASCADE' })
    stockLocations: StockLocation[];
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


### products

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product#product'>Product</a>[]`}   />


### productVariants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}   />


### facetValues

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]`}   />


### facets

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>[]`}   />


### collections

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>[]`}   />


### promotions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>[]`}   />


### paymentMethods

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>[]`}   />


### shippingMethods

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>[]`}   />


### customers

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>[]`}   />


### roles

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/role#role'>Role</a>[]`}   />


### stockLocations

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]`}   />




</div>
