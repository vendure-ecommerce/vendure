---
title: "PageTabConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PageTabConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/page/page.service.ts" sourceLine="14" packageName="@vendure/admin-ui" />

The object used to configure a new page tab.

```ts title="Signature"
interface PageTabConfig {
    location: PageLocationId;
    tabIcon?: string;
    route: string;
    tab: string;
    priority?: number;
    component: Type<any> | ReturnType<typeof detailComponentWithResolver>;
    routeConfig?: Route;
}
```

<div className="members-wrapper">

### location

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/action-bar/page-location-id#pagelocationid'>PageLocationId</a>`}   />

A valid location representing a list or detail page.
### tabIcon

<MemberInfo kind="property" type={`string`}   />

An optional icon to display in the tab. The icon
should be a valid shape name from the [Clarity Icons](https://core.clarity.design/foundation/icons/shapes/)
set.
### route

<MemberInfo kind="property" type={`string`}   />

The route path to the tab. This will be appended to the
route of the parent page.
### tab

<MemberInfo kind="property" type={`string`}   />

The name of the tab to display in the UI.
### priority

<MemberInfo kind="property" type={`number`}   />

The priority of the tab. Tabs with a lower priority will be displayed first.
### component

<MemberInfo kind="property" type={`Type&#60;any&#62; | ReturnType&#60;typeof <a href='/reference/admin-ui-api/list-detail-views/detail-component-with-resolver#detailcomponentwithresolver'>detailComponentWithResolver</a>&#62;`}   />

The component to render at the route of the tab.
### routeConfig

<MemberInfo kind="property" type={`Route`}   />

You can optionally provide any native Angular route configuration options here.
Any values provided here will take precedence over the values generated
by the `route` and `component` properties.


</div>
