---
title: "RegisterPageTab"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerPageTab

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/page/page.service.ts" sourceLine="78" packageName="@vendure/admin-ui" />

Add a tab to an existing list or detail page.

*Example*

```ts
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

```ts title="Signature"
function registerPageTab(config: PageTabConfig): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/tabs/page-tab-config#pagetabconfig'>PageTabConfig</a>`} />

