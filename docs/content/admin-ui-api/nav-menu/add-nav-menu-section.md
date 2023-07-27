---
title: "AddNavMenuSection"
weight: 10
date: 2023-07-14T16:57:51.123Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# addNavMenuSection
<div class="symbol">


# addNavMenuSection

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder.service.ts" sourceLine="44" packageName="@vendure/admin-ui">}}

Add a section to the main nav menu. Providing the `before` argument will
move the section before any existing section with the specified id. If
omitted (or if the id is not found) the section will be appended to the
existing set of sections.
This should be used in the NgModule `providers` array of your ui extension module.

*Example*

```TypeScript
@NgModule({
  imports: [SharedModule],
  providers: [
    addNavMenuSection({
      id: 'reports',
      label: 'Reports',
      items: [{
          // ...
      }],
    },
    'settings'),
  ],
})
export class MyUiExtensionModule {}
```

## Signature

```TypeScript
function addNavMenuSection(config: NavMenuSection, before?: string): Provider
```
## Parameters

### config

{{< member-info kind="parameter" type="<a href='/admin-ui-api/nav-menu/nav-menu-section#navmenusection'>NavMenuSection</a>" >}}

### before

{{< member-info kind="parameter" type="string" >}}

</div>
