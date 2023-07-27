---
title: "TypedBaseDetailComponent"
weight: 10
date: 2023-07-14T16:57:51.043Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TypedBaseDetailComponent
<div class="symbol">


# TypedBaseDetailComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/common/base-detail.component.ts" sourceLine="179" packageName="@vendure/admin-ui">}}

A version of the <a href='/admin-ui-api/list-detail-views/base-detail-component#basedetailcomponent'>BaseDetailComponent</a> which is designed to be used with a
[TypedDocumentNode](https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node).

## Signature

```TypeScript
class TypedBaseDetailComponent<T extends TypedDocumentNode<any, any>, Field extends keyof ResultOf<T>> extends BaseDetailComponent<NonNullable<ResultOf<T>[Field]>> {
  protected protected result$: Observable<ResultOf<T>>;
  protected protected entity: ResultOf<T>[Field];
  constructor()
  override init() => ;
}
```
## Extends

 * <a href='/admin-ui-api/list-detail-views/base-detail-component#basedetailcomponent'>BaseDetailComponent</a>&#60;NonNullable&#60;ResultOf&#60;T&#62;[Field]&#62;&#62;


## Members

### result$

{{< member-info kind="property" type="Observable&#60;ResultOf&#60;T&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### entity

{{< member-info kind="property" type="ResultOf&#60;T&#62;[Field]"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="() => TypedBaseDetailComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
