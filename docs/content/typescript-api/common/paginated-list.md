---
title: "PaginatedList"
weight: 10
date: 2023-07-14T16:57:50.656Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaginatedList
<div class="symbol">


# PaginatedList

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="66" packageName="@vendure/common">}}

A type describing the shape of a paginated list response. In Vendure, almost all list queries
(`products`, `collections`, `orders`, `customers` etc) return an object of this type.

## Signature

```TypeScript
type PaginatedList<T> = {
  items: T[];
  totalItems: number;
}
```
## Members

### items

{{< member-info kind="property" type="T[]"  >}}

{{< member-description >}}{{< /member-description >}}

### totalItems

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
