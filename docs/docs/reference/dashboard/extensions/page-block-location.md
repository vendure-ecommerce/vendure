---
title: "PageBlockLocation"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PageBlockLocation

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/extension-api-types.ts" sourceLine="67" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

The location of a page block in the dashboard. The location can be found by turning on
"developer mode" in the dashboard user menu (bottom left corner) and then
clicking the `< />` icon when hovering over a page block.

```ts title="Signature"
type PageBlockLocation = {
    pageId: string;
    position: PageBlockPosition;
    column: 'main' | 'side';
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />


### position

<MemberInfo kind="property" type={`PageBlockPosition`}   />


### column

<MemberInfo kind="property" type={`'main' | 'side'`}   />




</div>
