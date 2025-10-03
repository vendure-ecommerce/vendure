---
title: "Routes"
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

<MemberInfo kind="property" type={`Partial&#60;<a href='/reference/dashboard/extensions-api/navigation#navmenuitem'>NavMenuItem</a>&#62; &#38; { sectionId: string }`}   />

Optional navigation menu item configuration to add this route to the nav menu
on the left side of the dashboard.

The `sectionId` specifies which nav menu section (e.g. "catalog", "customers")
this item should appear in. It can also point to custom nav menu sections that
have been defined using the `navSections` extension property.
### loader

<MemberInfo kind="property" type={`RouteOptions['loader']`}   />

Optional loader function to fetch data before the route renders.
The value is a Tanstack Router
[loader function](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#route-loaders)


</div>
