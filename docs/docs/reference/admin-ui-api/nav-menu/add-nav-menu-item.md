---
title: "AddNavMenuItem"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## addNavMenuItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/add-nav-menu-item.ts" sourceLine="68" packageName="@vendure/admin-ui" />

Add a menu item to an existing section specified by `sectionId`. The id of the section
can be found by inspecting the DOM and finding the `data-section-id` attribute.
Providing the `before` argument will move the item before any existing item with the specified id.
If omitted (or if the name is not found) the item will be appended to the
end of the section.

This should be used in the NgModule `providers` array of your ui extension module.

*Example*

```ts title="providers.ts"
import { addNavMenuItem } from '@vendure/admin-ui/core';

export default [
    addNavMenuItem({
        id: 'reviews',
        label: 'Product Reviews',
        routerLink: ['/extensions/reviews'],
        icon: 'star',
    },
    'marketing'),
];
```

```ts title="Signature"
function addNavMenuItem(config: NavMenuItem, sectionId: string, before?: string): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>`} />

### sectionId

<MemberInfo kind="parameter" type={`string`} />

### before

<MemberInfo kind="parameter" type={`string`} />

