---
title: "RegisterPageTab"
weight: 10
date: 2023-07-14T16:57:51.138Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# registerPageTab
<div class="symbol">


# registerPageTab

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/page/page.service.ts" sourceLine="78" packageName="@vendure/admin-ui">}}

Add a tab to an existing list or detail page.

*Example*

```TypeScript
@NgModule({
  imports: [SharedModule],
  providers: [
    registerPageTab({
      location: 'product-list',
      tab: 'Deleted Products',
      route: 'deleted',
      component: DeletedProductListComponent,
    }),
  ],
})
export class MyUiExtensionModule {}
```

## Signature

```TypeScript
function registerPageTab(config: PageTabConfig): Provider
```
## Parameters

### config

{{< member-info kind="parameter" type="<a href='/admin-ui-api/tabs/page-tab-config#pagetabconfig'>PageTabConfig</a>" >}}

</div>
