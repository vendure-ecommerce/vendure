---
title: "OrderHistoryEntry"
weight: 10
date: 2023-07-14T16:57:49.887Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderHistoryEntry
<div class="symbol">


# OrderHistoryEntry

{{< generation-info sourceFile="packages/core/src/entity/history-entry/order-history-entry.entity.ts" sourceLine="14" packageName="@vendure/core">}}

Represents an event in the history of a particular <a href='/typescript-api/entities/order#order'>Order</a>.

## Signature

```TypeScript
class OrderHistoryEntry extends HistoryEntry {
  constructor(input: DeepPartial<OrderHistoryEntry>)
  @Index() @ManyToOne(type => Order, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Order, { onDelete: 'CASCADE' })
    order: Order;
}
```
## Extends

 * <a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>


## Members

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/order-history-entry#orderhistoryentry'>OrderHistoryEntry</a>&#62;) => OrderHistoryEntry"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
