---
title: "IfPermissionsDirective"
weight: 10
date: 2023-07-14T16:57:51.265Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# IfPermissionsDirective
<div class="symbol">


# IfPermissionsDirective

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/directives/if-permissions.directive.ts" sourceLine="33" packageName="@vendure/admin-ui">}}

Conditionally shows/hides templates based on the current active user having the specified permission.
Based on the ngIf source. Also support "else" templates:

*Example*

```html
<button *vdrIfPermissions="'DeleteCatalog'; else unauthorized">Delete Product</button>
<ng-template #unauthorized>Not allowed!</ng-template>
```

The permission can be a single string, or an array. If an array is passed, then _all_ of the permissions
must match (logical AND)

## Signature

```TypeScript
class IfPermissionsDirective extends IfDirectiveBase<Array<Permission[] | null>> {
  constructor(_viewContainer: ViewContainerRef, templateRef: TemplateRef<any>, dataService: DataService, changeDetectorRef: ChangeDetectorRef)
}
```
## Extends

 * IfDirectiveBase&#60;Array&#60;<a href='/typescript-api/common/permission#permission'>Permission</a>[] | null&#62;&#62;


## Members

### constructor

{{< member-info kind="method" type="(_viewContainer: ViewContainerRef, templateRef: TemplateRef&#60;any&#62;, dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>, changeDetectorRef: ChangeDetectorRef) => IfPermissionsDirective"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
