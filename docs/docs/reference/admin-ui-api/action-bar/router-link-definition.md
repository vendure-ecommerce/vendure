---
title: "RouterLinkDefinition"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RouterLinkDefinition

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="289" packageName="@vendure/admin-ui" />

A function which returns the router link for an <a href='/reference/admin-ui-api/action-bar/action-bar-item#actionbaritem'>ActionBarItem</a> or <a href='/reference/admin-ui-api/nav-menu/nav-menu-item#navmenuitem'>NavMenuItem</a>.

```ts title="Signature"
type RouterLinkDefinition = ((route: ActivatedRoute, context: ActionBarContext) => any[]) | any[]
```
