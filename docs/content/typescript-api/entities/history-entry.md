---
title: "HistoryEntry"
weight: 10
date: 2023-07-14T16:57:49.884Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HistoryEntry
<div class="symbol">


# HistoryEntry

{{< generation-info sourceFile="packages/core/src/entity/history-entry/history-entry.entity.ts" sourceLine="14" packageName="@vendure/core">}}

An abstract entity representing an entry in the history of an Order (<a href='/typescript-api/entities/order-history-entry#orderhistoryentry'>OrderHistoryEntry</a>)
or a Customer (<a href='/typescript-api/entities/customer-history-entry#customerhistoryentry'>CustomerHistoryEntry</a>).

## Signature

```TypeScript
class HistoryEntry extends VendureEntity {
  @Index() @ManyToOne(type => Administrator) @Index()
    @ManyToOne(type => Administrator)
    administrator?: Administrator;
  @Column({ nullable: false, type: 'varchar' }) readonly @Column({ nullable: false, type: 'varchar' })
    readonly type: HistoryEntryType;
  @Column() @Column()
    isPublic: boolean;
  @Column('simple-json') @Column('simple-json')
    data: any;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### administrator

{{< member-info kind="property" type="<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### type

{{< member-info kind="property" type="HistoryEntryType"  >}}

{{< member-description >}}{{< /member-description >}}

### isPublic

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### data

{{< member-info kind="property" type="any"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
