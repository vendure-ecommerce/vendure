---
title: "Fulfillment"
weight: 10
date: 2023-07-14T16:57:49.880Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Fulfillment
<div class="symbol">


# Fulfillment

{{< generation-info sourceFile="packages/core/src/entity/fulfillment/fulfillment.entity.ts" sourceLine="17" packageName="@vendure/core">}}

This entity represents a fulfillment of an Order or part of it, i.e. which <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>s have been
delivered to the Customer after successful payment.

## Signature

```TypeScript
class Fulfillment extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<Fulfillment>)
  @Column('varchar') @Column('varchar') state: FulfillmentState;
  @Column({ default: '' }) @Column({ default: '' })
    trackingCode: string;
  @Column() @Column()
    method: string;
  @Column() @Column()
    handlerCode: string;
  @OneToMany(type => FulfillmentLine, fulfillmentLine => fulfillmentLine.fulfillment) @OneToMany(type => FulfillmentLine, fulfillmentLine => fulfillmentLine.fulfillment)
    lines: FulfillmentLine[];
  @Column(type => CustomFulfillmentFields) @Column(type => CustomFulfillmentFields)
    customFields: CustomFulfillmentFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>&#62;) => Fulfillment"  >}}

{{< member-description >}}{{< /member-description >}}

### state

{{< member-info kind="property" type="<a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### trackingCode

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### method

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### handlerCode

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### lines

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomFulfillmentFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
