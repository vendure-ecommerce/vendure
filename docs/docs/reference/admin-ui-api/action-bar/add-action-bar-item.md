---
title: "AddActionBarItem"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## addActionBarItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/add-action-bar-item.ts" sourceLine="23" packageName="@vendure/admin-ui" />

Adds a button to the ActionBar at the top right of each list or detail view. The locationId can
be determined by pressing `ctrl + u` when running the Admin UI in dev mode.

*Example*

```ts title="providers.ts"
export default [
    addActionBarItem({
        id: 'print-invoice',
        label: 'Print Invoice',
        locationId: 'order-detail',
        routerLink: ['/extensions/invoicing'],
    }),
];
```

```ts title="Signature"
function addActionBarItem(config: ActionBarItem): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/action-bar/action-bar-item#actionbaritem'>ActionBarItem</a>`} />

