---
title: "NavMenuItem"
weight: 10
date: 2023-07-14T16:57:51.109Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# NavMenuItem
<div class="symbol">


# NavMenuItem

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="36" packageName="@vendure/admin-ui">}}

A NavMenuItem is a menu item in the main (left-hand side) nav
bar.

## Signature

```TypeScript
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
## Members

### id

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### label

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### routerLink

{{< member-info kind="property" type="RouterLinkDefinition"  >}}

{{< member-description >}}{{< /member-description >}}

### onClick

{{< member-info kind="property" type="(event: MouseEvent) =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### icon

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### requiresPermission

{{< member-info kind="property" type="string | ((userPermissions: string[]) =&#62; boolean)"  >}}

{{< member-description >}}{{< /member-description >}}

### statusBadge

{{< member-info kind="property" type="Observable&#60;<a href='/admin-ui-api/nav-menu/navigation-types#navmenubadge'>NavMenuBadge</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
