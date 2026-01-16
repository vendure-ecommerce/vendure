---
title: "StockLocation"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockLocation

<GenerationInfo sourceFile="packages/core/src/entity/stock-location/stock-location.entity.ts" sourceLine="22" packageName="@vendure/core" />

A StockLocation represents a physical location where stock is held. For example, a warehouse or a shop.

When the stock of a <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> is adjusted, the adjustment is applied to a specific StockLocation,
and the stockOnHand of that ProductVariant is updated accordingly. When there are multiple StockLocations
configured, the <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a> is used to determine which StockLocation should be used for
a given operation.

```ts title="Signature"
class StockLocation extends VendureEntity implements HasCustomFields, ChannelAware {
    constructor(input: DeepPartial<StockLocation>)
    @Column()
    name: string;
    @Column()
    description: string;
    @Column(type => CustomStockLocationFields)
    customFields: CustomStockLocationFields;
    @ManyToMany(type => Channel, channel => channel.stockLocations)
    @JoinTable()
    channels: Channel[];
    @OneToMany(type => StockMovement, movement => movement.stockLocation)
    stockMovements: StockMovement[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;) => StockLocation`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### description

<MemberInfo kind="property" type={`string`}   />


### customFields

<MemberInfo kind="property" type={`CustomStockLocationFields`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### stockMovements

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>[]`}   />




</div>
