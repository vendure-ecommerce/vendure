---
title: "ShippingMethod"
weight: 10
date: 2023-07-14T16:57:50.002Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ShippingMethod
<div class="symbol">


# ShippingMethod

{{< generation-info sourceFile="packages/core/src/entity/shipping-method/shipping-method.entity.ts" sourceLine="33" packageName="@vendure/core">}}

A ShippingMethod is used to apply a shipping price to an <a href='/typescript-api/entities/order#order'>Order</a>. It is composed of a
<a href='/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a> and a <a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>. For a given Order,
the `checker` is used to determine whether this ShippingMethod can be used. If yes, then
the ShippingMethod can be applied and the `calculator` is used to determine the price of
shipping.

## Signature

```TypeScript
class ShippingMethod extends VendureEntity implements ChannelAware, SoftDeletable, HasCustomFields, Translatable {
  constructor(input?: DeepPartial<ShippingMethod>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column() @Column() code: string;
  name: LocaleString;
  description: LocaleString;
  @Column('simple-json') @Column('simple-json') checker: ConfigurableOperation;
  @Column('simple-json') @Column('simple-json') calculator: ConfigurableOperation;
  @Column() @Column()
    fulfillmentHandlerCode: string;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
  @OneToMany(type => ShippingMethodTranslation, translation => translation.base, { eager: true }) @OneToMany(type => ShippingMethodTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ShippingMethod>>;
  @Column(type => CustomShippingMethodFields) @Column(type => CustomShippingMethodFields)
    customFields: CustomShippingMethodFields;
  async apply(ctx: RequestContext, order: Order) => Promise<ShippingCalculationResult | undefined>;
  async test(ctx: RequestContext, order: Order) => Promise<boolean>;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;) => ShippingMethod"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### checker

{{< member-info kind="property" type="ConfigurableOperation"  >}}

{{< member-description >}}{{< /member-description >}}

### calculator

{{< member-info kind="property" type="ConfigurableOperation"  >}}

{{< member-description >}}{{< /member-description >}}

### fulfillmentHandlerCode

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomShippingMethodFields"  >}}

{{< member-description >}}{{< /member-description >}}

### apply

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/shipping/shipping-calculator#shippingcalculationresult'>ShippingCalculationResult</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### test

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
