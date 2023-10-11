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

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-page-tab.ts" sourceLine="24" packageName="@vendure/admin-ui" />

Add a tab to an existing list or detail page.

*Example*

```ts title="providers.ts"
import { registerPageTab } from '@vendure/admin-ui/core';
import { DeletedProductListComponent } from './components/deleted-product-list/deleted-product-list.component';

export default [
    registerPageTab({
        location: 'product-list',
        tab: 'Deleted Products',
        route: 'deleted',
        component: DeletedProductListComponent,
    }),
];
```

```ts title="Signature"
function registerPageTab(config: PageTabConfig): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/tabs/page-tab-config#pagetabconfig'>PageTabConfig</a>`} />

