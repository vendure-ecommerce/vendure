---
title: "PageTabConfig"
weight: 10
date: 2023-07-14T16:57:51.134Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PageTabConfig
<div class="symbol">


# PageTabConfig

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/page/page.service.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

The object used to configure a new page tab.

## Signature

```TypeScript
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
## Members

### location

{{< member-info kind="property" type="<a href='/admin-ui-api/action-bar/page-location-id#pagelocationid'>PageLocationId</a>"  >}}

{{< member-description >}}A valid location representing a list or detail page.{{< /member-description >}}

### tabIcon

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}An optional icon to display in the tab. The icon
should be a valid shape name from the [Clarity Icons](https://core.clarity.design/foundation/icons/shapes/)
set.{{< /member-description >}}

### route

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The route path to the tab. This will be appended to the
route of the parent page.{{< /member-description >}}

### tab

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the tab to display in the UI.{{< /member-description >}}

### priority

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The priority of the tab. Tabs with a lower priority will be displayed first.{{< /member-description >}}

### component

{{< member-info kind="property" type="Type&#60;any&#62; | ReturnType&#60;typeof <a href='/admin-ui-api/list-detail-views/detail-component-with-resolver#detailcomponentwithresolver'>detailComponentWithResolver</a>&#62;"  >}}

{{< member-description >}}The component to render at the route of the tab.{{< /member-description >}}

### routeConfig

{{< member-info kind="property" type="Route"  >}}

{{< member-description >}}You can optionally provide any native Angular route configuration options here.
Any values provided here will take precedence over the values generated
by the `route` and `component` properties.{{< /member-description >}}


</div>
