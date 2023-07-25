---
title: "ActionBarItem"
weight: 10
date: 2023-07-14T16:57:51.118Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ActionBarItem
<div class="symbol">


# ActionBarItem

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="89" packageName="@vendure/admin-ui">}}

A button in the ActionBar area at the top of one of the list or detail views.

## Signature

```TypeScript
interface ActionBarItem {
  id: string;
  label: string;
  locationId: ActionBarLocationId;
  disabled?: Observable<boolean>;
  onClick?: (event: MouseEvent, context: OnClickContext) => void;
  routerLink?: RouterLinkDefinition;
  buttonColor?: 'primary' | 'success' | 'warning';
  buttonStyle?: 'solid' | 'outline' | 'link';
  icon?: string;
  requiresPermission?: string | string[];
}
```
## Members

### id

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### label

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### locationId

{{< member-info kind="property" type="<a href='/admin-ui-api/action-bar/action-bar-location-id#actionbarlocationid'>ActionBarLocationId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### disabled

{{< member-info kind="property" type="Observable&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onClick

{{< member-info kind="property" type="(event: MouseEvent, context: <a href='/admin-ui-api/action-bar/on-click-context#onclickcontext'>OnClickContext</a>) =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### routerLink

{{< member-info kind="property" type="RouterLinkDefinition"  >}}

{{< member-description >}}{{< /member-description >}}

### buttonColor

{{< member-info kind="property" type="'primary' | 'success' | 'warning'"  >}}

{{< member-description >}}{{< /member-description >}}

### buttonStyle

{{< member-info kind="property" type="'solid' | 'outline' | 'link'"  >}}

{{< member-description >}}{{< /member-description >}}

### icon

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### requiresPermission

{{< member-info kind="property" type="string | string[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
