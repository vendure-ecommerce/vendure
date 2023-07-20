---
title: "CustomerHistoryEntry"
weight: 10
date: 2023-07-14T16:57:49.883Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CustomerHistoryEntry
<div class="symbol">


# CustomerHistoryEntry

{{< generation-info sourceFile="packages/core/src/entity/history-entry/customer-history-entry.entity.ts" sourceLine="14" packageName="@vendure/core">}}

Represents an event in the history of a particular <a href='/typescript-api/entities/customer#customer'>Customer</a>.

## Signature

```TypeScript
class CustomerHistoryEntry extends HistoryEntry {
  constructor(input: DeepPartial<CustomerHistoryEntry>)
  @Index() @ManyToOne(type => Customer, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Customer, { onDelete: 'CASCADE' })
    customer: Customer;
}
```
## Extends

 * <a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>


## Members

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/customer-history-entry#customerhistoryentry'>CustomerHistoryEntry</a>&#62;) => CustomerHistoryEntry"  >}}

{{< member-description >}}{{< /member-description >}}

### customer

{{< member-info kind="property" type="<a href='/typescript-api/entities/customer#customer'>Customer</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
