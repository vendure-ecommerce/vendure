---
title: "Navigation Types"
weight: 10
date: 2023-07-14T16:57:51.108Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# navigation-types
<div class="symbol">


# NavMenuBadge

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="18" packageName="@vendure/admin-ui">}}

A color-coded notification badge which will be displayed by the
NavMenuItem's icon.

## Signature

```TypeScript
interface NavMenuBadge {
  type: NavMenuBadgeType;
  propagateToSection?: boolean;
}
```
## Members

### type

{{< member-info kind="property" type="NavMenuBadgeType"  >}}

{{< member-description >}}{{< /member-description >}}

### propagateToSection

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}If true, the badge will propagate to the NavMenuItem's
parent section, displaying a notification badge next
to the section name.{{< /member-description >}}


</div>
