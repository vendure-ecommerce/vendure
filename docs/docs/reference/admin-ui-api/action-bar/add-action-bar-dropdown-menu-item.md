---
title: "AddActionBarDropdownMenuItem"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## addActionBarDropdownMenuItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/add-action-bar-dropdown-menu-item.ts" sourceLine="27" packageName="@vendure/admin-ui" since="2.2.0" />

Adds a dropdown menu item to the ActionBar at the top right of each list or detail view. The locationId can
be determined by pressing `ctrl + u` when running the Admin UI in dev mode.

*Example*

```ts title="providers.ts"
import { addActionBarDropdownMenuItem } from '@vendure/admin-ui/core';

export default [
    addActionBarDropdownMenuItem({
        id: 'print-invoice',
        label: 'Print Invoice',
        locationId: 'order-detail',
        routerLink: ['/extensions/invoicing'],
    }),
];
```

```ts title="Signature"
function addActionBarDropdownMenuItem(config: ActionBarDropdownMenuItem): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/action-bar/action-bar-dropdown-menu-item#actionbardropdownmenuitem'>ActionBarDropdownMenuItem</a>`} />

