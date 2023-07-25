---
title: "AddNavMenuItem"
weight: 10
date: 2023-07-14T16:57:51.124Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# addNavMenuItem
<div class="symbol">


# addNavMenuItem

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder.service.ts" sourceLine="84" packageName="@vendure/admin-ui">}}

Add a menu item to an existing section specified by `sectionId`. The id of the section
can be found by inspecting the DOM and finding the `data-section-id` attribute.
Providing the `before` argument will move the item before any existing item with the specified id.
If omitted (or if the name is not found) the item will be appended to the
end of the section.

This should be used in the NgModule `providers` array of your ui extension module.

*Example*

```TypeScript
@NgModule({
  imports: [SharedModule],
  providers: [
    addNavMenuItem({
      id: 'reviews',
      label: 'Product Reviews',
      routerLink: ['/extensions/reviews'],
      icon: 'star',
    },
    'marketing'),
  ],
})
export class MyUiExtensionModule {}
``

## Signature

```TypeScript
function addNavMenuItem(config: NavMenuItem, sectionId: string, before?: string): Provider
```
## Parameters

### config

{{< member-info kind="parameter" type="<a href='/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>" >}}

### sectionId

{{< member-info kind="parameter" type="string" >}}

### before

{{< member-info kind="parameter" type="string" >}}

</div>
