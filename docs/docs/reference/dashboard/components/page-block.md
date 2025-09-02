---
title: "PageBlock"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PageBlock

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="407" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

A component for displaying a block of content on a page. This should be used inside the <a href='/reference/dashboard/components/page-layout#pagelayout'>PageLayout</a> component.
It should be provided with a `column` prop to determine which column it should appear in, and a `blockId` prop
to identify the block.

```ts title="Signature"
function PageBlock(props: Readonly<PageBlockProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;<a href='/reference/dashboard/components/page-block#pageblockprops'>PageBlockProps</a>&#62;`} />



## PageBlockProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="384" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
type PageBlockProps = {
    children?: React.ReactNode;
    column: 'main' | 'side';
    blockId?: string;
    title?: React.ReactNode | string;
    description?: React.ReactNode | string;
    className?: string;
}
```

<div className="members-wrapper">

### children

<MemberInfo kind="property" type={`React.ReactNode`}   />


### column

<MemberInfo kind="property" type={`'main' | 'side'`}   />


### blockId

<MemberInfo kind="property" type={`string`}   />


### title

<MemberInfo kind="property" type={`React.ReactNode | string`}   />


### description

<MemberInfo kind="property" type={`React.ReactNode | string`}   />


### className

<MemberInfo kind="property" type={`string`}   />




</div>


## FullWidthPageBlock

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="452" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

A component for displaying a block of content on a page that takes up the full width of the page.
This should be used inside the <a href='/reference/dashboard/components/page-layout#pagelayout'>PageLayout</a> component.

```ts title="Signature"
function FullWidthPageBlock(props: Readonly<Pick<PageBlockProps, 'children' | 'className' | 'blockId'>>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;Pick&#60;<a href='/reference/dashboard/components/page-block#pageblockprops'>PageBlockProps</a>, 'children' | 'className' | 'blockId'&#62;&#62;`} />



## CustomFieldsPageBlock

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/layout-engine/page-layout.tsx" sourceLine="477" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

A component for displaying an auto-generated form for custom fields on a page.

```ts title="Signature"
function CustomFieldsPageBlock(props: Readonly<{
    column: 'main' | 'side';
    entityType: string;
    control: Control<any, any>;
}>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;{     column: 'main' | 'side';     entityType: string;     control: Control&#60;any, any&#62;; }&#62;`} />

