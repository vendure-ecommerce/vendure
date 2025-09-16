---
title: "PageLayout"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PageLayout

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="204" packageName="@vendure/dashboard" since="3.3.0" />

*
This component governs the layout of the contents of a <a href='/reference/dashboard/page-layout/page#page'>Page</a> component.
It should contain all the <a href='/reference/dashboard/page-layout/page-block#pageblock'>PageBlock</a> components that are to be displayed on the page.

```ts title="Signature"
function PageLayout(props: Readonly<PageLayoutProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/page-layout/#pagelayoutprops'>PageLayoutProps</a>&#62;`} />



## PageLayoutProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="176" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
type PageLayoutProps = {
    children: React.ReactNode;
    className?: string;
}
```

<div className="members-wrapper">

### children

<MemberInfo kind="property" type={`React.ReactNode`}   />


### className

<MemberInfo kind="property" type={`string`}   />




</div>
