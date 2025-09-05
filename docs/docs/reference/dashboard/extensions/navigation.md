---
title: "Navigation"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardRouteDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/navigation.ts" sourceLine="15" packageName="@vendure/dashboard" since="3.4.0" />

Defines a custom route for the dashboard with optional navigation menu integration.

```ts title="Signature"
interface DashboardRouteDefinition {
    component: (route: AnyRoute) => React.ReactNode;
    path: string;
    navMenuItem?: Partial<NavMenuItem> & { sectionId: string };
    loader?: RouteOptions['loader'];
}
```

<div className="members-wrapper">

### component

<MemberInfo kind="property" type={`(route: AnyRoute) =&#62; React.ReactNode`}   />

The React component that will be rendered for this route.
### path

<MemberInfo kind="property" type={`string`}   />

The URL path for this route, e.g. '/my-custom-page'.
### navMenuItem

<MemberInfo kind="property" type={`Partial&#60;<a href='/reference/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>&#62; &#38; { sectionId: string }`}   />

Optional navigation menu item configuration to add this route to the nav menu
on the left side of the dashboard.
### loader

<MemberInfo kind="property" type={`RouteOptions['loader']`}   />

Optional loader function to fetch data before the route renders.
The value is a Tanstack Router
[loader function](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#route-loaders)


</div>


## DashboardNavSectionDefinition

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/navigation.ts" sourceLine="49" packageName="@vendure/dashboard" since="3.4.0" />

Defines a custom navigation section in the dashboard sidebar.

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
