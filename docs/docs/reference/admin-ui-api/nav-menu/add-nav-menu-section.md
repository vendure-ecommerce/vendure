---
title: "AddNavMenuSection"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## addNavMenuSection

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/add-nav-menu-item.ts" sourceLine="30" packageName="@vendure/admin-ui" />

Add a section to the main nav menu. Providing the `before` argument will
move the section before any existing section with the specified id. If
omitted (or if the id is not found) the section will be appended to the
existing set of sections.
This should be used in the NgModule `providers` array of your ui extension module.

*Example*

```ts title="providers.ts"
import { addNavMenuSection } from '@vendure/admin-ui/core';

export default [
    addNavMenuSection({
        id: 'reports',
        label: 'Reports',
        items: [{
            // ...
        }],
    },
    'settings'),
];
```

```ts title="Signature"
function addNavMenuSection(config: NavMenuSection, before?: string): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/nav-menu/nav-menu-section#navmenusection'>NavMenuSection</a>`} />

### before

<MemberInfo kind="parameter" type={`string`} />

