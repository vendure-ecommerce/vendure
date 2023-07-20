---
title: "Tag"
weight: 10
date: 2023-07-14T16:57:50.029Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Tag
<div class="symbol">


# Tag

{{< generation-info sourceFile="packages/core/src/entity/tag/tag.entity.ts" sourceLine="13" packageName="@vendure/core">}}

A tag is an arbitrary label which can be applied to certain entities.
It is used to help organize and filter those entities.

## Signature

```TypeScript
class Tag extends VendureEntity {
  constructor(input?: DeepPartial<Tag>)
  @Column() @Column()
    value: string;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/tag#tag'>Tag</a>&#62;) => Tag"  >}}

{{< member-description >}}{{< /member-description >}}

### value

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
