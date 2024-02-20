---
title: "IfPermissionsDirective"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## IfPermissionsDirective

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/directives/if-permissions.directive.ts" sourceLine="26" packageName="@vendure/admin-ui" />

Conditionally shows/hides templates based on the current active user having the specified permission.
Based on the ngIf source. Also support "else" templates:

*Example*

```html
<button *vdrIfPermissions="'DeleteCatalog'; else unauthorized">Delete Product</button>
<ng-template #unauthorized>Not allowed!</ng-template>
```

The permission can be a single string, or an array. If an array is passed, then _all_ of the permissions
must match (logical AND)

```ts title="Signature"
class IfPermissionsDirective extends IfDirectiveBase<Array<Permission[] | null>> {
    constructor(_viewContainer: ViewContainerRef, templateRef: TemplateRef<any>, changeDetectorRef: ChangeDetectorRef, permissionsService: PermissionsService)
}
```
* Extends: <code>IfDirectiveBase&#60;Array&#60;<a href='/reference/typescript-api/common/permission#permission'>Permission</a>[] | null&#62;&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(_viewContainer: ViewContainerRef, templateRef: TemplateRef&#60;any&#62;, changeDetectorRef: ChangeDetectorRef, permissionsService: PermissionsService) => IfPermissionsDirective`}   />




</div>
