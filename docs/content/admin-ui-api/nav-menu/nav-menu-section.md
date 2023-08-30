---
title: "NavMenuSection"
weight: 10
date: 2023-07-14T16:57:51.113Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# NavMenuSection
<div class="symbol">


# NavMenuSection

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="56" packageName="@vendure/admin-ui">}}

A NavMenuSection is a grouping of links in the main
(left-hand side) nav bar.

## Signature

```TypeScript
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
## Members

### id

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### label

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### items

{{< member-info kind="property" type="<a href='/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### icon

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### displayMode

{{< member-info kind="property" type="'regular' | 'settings'"  >}}

{{< member-description >}}{{< /member-description >}}

### requiresPermission

{{< member-info kind="property" type="string | ((userPermissions: string[]) =&#62; boolean)"  >}}

{{< member-description >}}Control the display of this item based on the user permissions.{{< /member-description >}}

### collapsible

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### collapsedByDefault

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
