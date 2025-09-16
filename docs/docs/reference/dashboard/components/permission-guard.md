---
title: "PermissionGuard"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PermissionGuard

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/permission-guard.tsx" sourceLine="44" packageName="@vendure/dashboard" since="3.4.0" />

This component is used to protect a route from unauthorized access.
It will render the children if the user has the required permissions.

*Example*

```tsx
<PermissionGuard requires={['UpdateTaxCategory']}>
    <Button type="submit">
        <Trans>Update</Trans>
    </Button>
</PermissionGuard>
```

```ts title="Signature"
function PermissionGuard(props: Readonly<PermissionGuardProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/components/permission-guard#permissionguardprops'>PermissionGuardProps</a>&#62;`} />



## PermissionGuardProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/permission-guard.tsx" sourceLine="12" packageName="@vendure/dashboard" since="3.4.0" />

The props for the PermissionGuard component.

```ts title="Signature"
interface PermissionGuardProps {
    requires: Permission | string | string[] | Permission[];
    children: React.ReactNode;
}
```

<div className="members-wrapper">

### requires

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a> | string | string[] | <a href='/reference/typescript-api/common/permission#permission'>Permission</a>[]`}   />

The permission(s) required to access the children.
### children

<MemberInfo kind="property" type={`React.ReactNode`}   />

The children to render if the user has the required permissions.


</div>
