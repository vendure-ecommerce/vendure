---
title: "Page"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Page

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="48" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

This component should be used to wrap _all_ pages in the dashboard. It provides
a consistent layout as well as a context for the slot-based PageBlock system.

The typical hierarchy of a page is as follows:
- `Page`
 - <a href='/reference/dashboard/components/page-title#pagetitle'>PageTitle</a>
 - <a href='/reference/dashboard/components/page-action-bar#pageactionbar'>PageActionBar</a>
 - <a href='/reference/dashboard/components/page-layout#pagelayout'>PageLayout</a>

```ts title="Signature"
function Page(props: Readonly<PageProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;PageProps&#62;`} />

