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

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/navigation.ts" sourceLine="73" packageName="@vendure/dashboard" since="3.4.0" />

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


## NavMenuItem

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/nav-menu/nav-menu-extensions.ts" sourceLine="16" packageName="@vendure/dashboard" since="3.4.0" />

Defines an items in the navigation menu.

```ts title="Signature"
interface NavMenuItem {
    id: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    order?: number;
    placement?: NavMenuSectionPlacement;
    requiresPermission?: string | string[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique ID for this nav menu item
### title

<MemberInfo kind="property" type={`string`}   />

The title that will appear in the nav menu
### url

<MemberInfo kind="property" type={`string`}   />

The url of the route which this nav item links to.
### icon

<MemberInfo kind="property" type={`LucideIcon`}   />

An optional icon component to represent the item,
which should be imported from `lucide-react`.
### order

<MemberInfo kind="property" type={`number`}   />

The order is an number which allows you to control
the relative position in relation to other items in the
menu.
A higher number appears further down the list.
### placement

<MemberInfo kind="property" type={`NavMenuSectionPlacement`}   />


### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />

This can be used to restrict the menu item to the given
permission or permissions.


</div>
