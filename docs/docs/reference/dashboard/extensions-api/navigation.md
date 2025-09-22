---
title: "Navigation"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardNavSectionDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/navigation.ts" sourceLine="57" packageName="@vendure/dashboard" since="3.4.0" />

Defines a custom navigation section in the dashboard sidebar.

Individual items can then be added to the section by defining routes in the
`routes` property of your Dashboard extension.

```ts title="Signature"
interface DashboardNavSectionDefinition {
    id: string;
    title: string;
    icon?: LucideIcon;
    order?: number;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the navigation section.
### title

<MemberInfo kind="property" type={`string`}   />

The display title for the navigation section.
### icon

<MemberInfo kind="property" type={`LucideIcon`}   />

Optional icon to display next to the section title. The icons should
be imported from `'lucide-react'`.

*Example*

```ts
import { PlusIcon } from 'lucide-react';
```
### order

<MemberInfo kind="property" type={`number`}   />

Optional order number to control the position of this section in the sidebar.


</div>


## NavMenuBaseItem

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/nav-menu/nav-menu-extensions.ts" sourceLine="16" packageName="@vendure/dashboard" since="3.4.0" />

The base configuration for navigation items and sections of the main app nav bar.

```ts title="Signature"
interface NavMenuBaseItem {
    id: string;
    title: string;
    icon?: LucideIcon;
    order?: number;
    placement?: NavMenuSectionPlacement;
    requiresPermission?: string | string[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### title

<MemberInfo kind="property" type={`string`}   />


### icon

<MemberInfo kind="property" type={`LucideIcon`}   />


### order

<MemberInfo kind="property" type={`number`}   />


### placement

<MemberInfo kind="property" type={`NavMenuSectionPlacement`}   />


### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />

This can be used to restrict the menu item to the given
permission or permissions.


</div>


## NavMenuItem

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/nav-menu/nav-menu-extensions.ts" sourceLine="38" packageName="@vendure/dashboard" since="3.4.0" />

Defines an items in the navigation menu.

```ts title="Signature"
interface NavMenuItem extends NavMenuBaseItem {
    url: string;
}
```
* Extends: <code><a href='/reference/dashboard/extensions-api/navigation#navmenubaseitem'>NavMenuBaseItem</a></code>



<div className="members-wrapper">

### url

<MemberInfo kind="property" type={`string`}   />

The url of the route which this nav item links to.


</div>
