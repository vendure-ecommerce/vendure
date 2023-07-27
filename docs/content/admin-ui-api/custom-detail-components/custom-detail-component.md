---
title: "CustomDetailComponent"
weight: 10
date: 2023-07-14T16:57:51.089Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CustomDetailComponent
<div class="symbol">


# CustomDetailComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-detail-component/custom-detail-component-types.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

CustomDetailComponents allow any arbitrary Angular components to be embedded in entity detail
pages of the Admin UI.

## Signature

```TypeScript
interface CustomDetailComponent {
  entity$: Observable<any>;
  detailForm: UntypedFormGroup;
}
```
## Members

### entity$

{{< member-info kind="property" type="Observable&#60;any&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### detailForm

{{< member-info kind="property" type="UntypedFormGroup"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
