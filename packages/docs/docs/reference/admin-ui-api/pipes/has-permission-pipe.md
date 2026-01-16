---
title: "HasPermissionPipe"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## HasPermissionPipe

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/pipes/has-permission.pipe.ts" sourceLine="16" packageName="@vendure/admin-ui" />

A pipe which checks the provided permission against all the permissions of the current user.
Returns `true` if the current user has that permission.

*Example*

```HTML
<button [disabled]="!('UpdateCatalog' | hasPermission)">Save Changes</button>
```

```ts title="Signature"
class HasPermissionPipe implements PipeTransform, OnDestroy {
    constructor(permissionsService: PermissionsService, changeDetectorRef: ChangeDetectorRef)
    transform(input: string | string[]) => any;
    ngOnDestroy() => ;
}
```
* Implements: <code>PipeTransform</code>, <code>OnDestroy</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(permissionsService: PermissionsService, changeDetectorRef: ChangeDetectorRef) => HasPermissionPipe`}   />


### transform

<MemberInfo kind="method" type={`(input: string | string[]) => any`}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => `}   />




</div>
