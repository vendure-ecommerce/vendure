---
title: "NavMenuSection"
weight: 10
date: 2023-07-20T13:56:17.997Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## NavMenuSection

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="56" packageName="@vendure/admin-ui" />

A NavMenuSection is a grouping of links in the main
(left-hand side) nav bar.

```ts title="Signature"
interface NavMenuSection {
  id: string;
  label: string;
  items: NavMenuItem[];
  icon?: string;
  displayMode?: 'regular' | 'settings';
  requiresPermission?: string | ((userPermissions: string[]) => boolean);
  collapsible?: boolean;
  collapsedByDefault?: boolean;
}
```

### id

<MemberInfo kind="property" type="string"   />


### label

<MemberInfo kind="property" type="string"   />


### items

<MemberInfo kind="property" type="<a href='/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>[]"   />


### icon

<MemberInfo kind="property" type="string"   />


### displayMode

<MemberInfo kind="property" type="'regular' | 'settings'"   />


### requiresPermission

<MemberInfo kind="property" type="string | ((userPermissions: string[]) =&#62; boolean)"   />

Control the display of this item based on the user permissions.
### collapsible

<MemberInfo kind="property" type="boolean"   />


### collapsedByDefault

<MemberInfo kind="property" type="boolean"   />


