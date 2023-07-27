---
title: "StockLocation"
weight: 10
date: 2023-07-14T16:57:50.012Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StockLocation
<div class="symbol">


# StockLocation

{{< generation-info sourceFile="packages/core/src/entity/stock-location/stock-location.entity.ts" sourceLine="21" packageName="@vendure/core">}}

A StockLocation represents a physical location where stock is held. For example, a warehouse or a shop.

When the stock of a <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> is adjusted, the adjustment is applied to a specific StockLocation,
and the stockOnHand of that ProductVariant is updated accordingly. When there are multiple StockLocations
configured, the <a href='/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a> is used to determine which StockLocation should be used for
a given operation.

## Signature

```TypeScript
class StockLocation extends VendureEntity implements HasCustomFields, ChannelAware {
  constructor(input: DeepPartial<StockLocation>)
  @Column() @Column()
    name: string;
  @Column() @Column()
    description: string;
  @Column(type => CustomStockLocationFields) @Column(type => CustomStockLocationFields)
    customFields: CustomStockLocationFields;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>


## Members

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;) => StockLocation"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomStockLocationFields"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
