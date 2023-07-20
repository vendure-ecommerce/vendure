---
title: "Seller"
weight: 10
date: 2023-07-14T16:57:49.987Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Seller
<div class="symbol">


# Seller

{{< generation-info sourceFile="packages/core/src/entity/seller/seller.entity.ts" sourceLine="16" packageName="@vendure/core">}}

A Seller represents the person or organization who is selling the goods on a given <a href='/typescript-api/entities/channel#channel'>Channel</a>.
By default, a single-channel Vendure installation will have a single default Seller.

## Signature

```TypeScript
class Seller extends VendureEntity implements SoftDeletable, HasCustomFields {
  constructor(input?: DeepPartial<Seller>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column() @Column() name: string;
  @Column(type => CustomSellerFields) @Column(type => CustomSellerFields)
    customFields: CustomSellerFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/seller#seller'>Seller</a>&#62;) => Seller"  >}}

{{< member-description >}}{{< /member-description >}}

### deletedAt

{{< member-info kind="property" type="Date | null"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomSellerFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
