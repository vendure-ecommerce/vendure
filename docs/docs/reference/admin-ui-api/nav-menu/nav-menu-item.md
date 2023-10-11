---
title: "NavMenuItem"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## NavMenuItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="37" packageName="@vendure/admin-ui" />

A NavMenuItem is a menu item in the main (left-hand side) nav
bar.

```ts title="Signature"
interface NavMenuItem {
    id: string;
    label: string;
    routerLink: RouterLinkDefinition;
    onClick?: (event: MouseEvent) => void;
    icon?: string;
    requiresPermission?: string | ((userPermissions: string[]) => boolean);
    statusBadge?: Observable<NavMenuBadge>;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### label

<MemberInfo kind="property" type={`string`}   />


### routerLink

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/action-bar/router-link-definition#routerlinkdefinition'>RouterLinkDefinition</a>`}   />


### onClick

<MemberInfo kind="property" type={`(event: MouseEvent) =&#62; void`}   />


### icon

<MemberInfo kind="property" type={`string`}   />


### requiresPermission

<MemberInfo kind="property" type={`string | ((userPermissions: string[]) =&#62; boolean)`}   />


### statusBadge

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/admin-ui-api/nav-menu/navigation-types#navmenubadge'>NavMenuBadge</a>&#62;`}   />




</div>
