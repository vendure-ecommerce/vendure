---
title: "PaginatedList"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaginatedList

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="67" packageName="@vendure/common" />

A type describing the shape of a paginated list response. In Vendure, almost all list queries
(`products`, `collections`, `orders`, `customers` etc) return an object of this type.

```ts title="Signature"
type PaginatedList<T> = {
    items: T[];
    totalItems: number;
}
```

<div className="members-wrapper">

### items

<MemberInfo kind="property" type={`T[]`}   />


### totalItems

<MemberInfo kind="property" type={`number`}   />




</div>
