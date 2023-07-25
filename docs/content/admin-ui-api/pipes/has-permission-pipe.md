---
title: "HasPermissionPipe"
weight: 10
date: 2023-07-14T16:57:51.329Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# HasPermissionPipe
<div class="symbol">


# HasPermissionPipe

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/has-permission.pipe.ts" sourceLine="17" packageName="@vendure/admin-ui">}}

A pipe which checks the provided permission against all the permissions of the current user.
Returns `true` if the current user has that permission.

*Example*

```HTML
<button [disabled]="!('UpdateCatalog' | hasPermission)">Save Changes</button>
```

## Signature

```TypeScript
class HasPermissionPipe implements PipeTransform, OnDestroy {
  constructor(dataService: DataService, changeDetectorRef: ChangeDetectorRef)
  transform(input: string | string[]) => any;
  ngOnDestroy() => ;
}
```
## Implements

 * PipeTransform
 * OnDestroy


## Members

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef: ChangeDetectorRef) => HasPermissionPipe"  >}}

{{< member-description >}}{{< /member-description >}}

### transform

{{< member-info kind="method" type="(input: string | string[]) => any"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnDestroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
