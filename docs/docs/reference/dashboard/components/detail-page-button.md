---
title: "DetailPageButton"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DetailPageButton

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/detail-page-button.tsx" sourceLine="33" packageName="@vendure/dashboard" since="3.4.0" />

DetailPageButton is a reusable navigation component designed to provide consistent UX
across list views when linking to detail pages. It renders as a ghost button with
a chevron indicator, making it easy for users to identify clickable links that
navigate to detail views.

*Example*

```tsx
// Basic usage with ID (relative navigation)
<DetailPageButton id="123" label="Product Name" />

*Example*

```tsx
// Custom href with search params
<DetailPageButton
  href="/products/detail/456"
  label="Custom Product"
  search={{ tab: 'variants' }}
/>
```

```ts title="Signature"
function DetailPageButton(props: {
    label: string | React.ReactNode;
    id?: string;
    href?: string;
    disabled?: boolean;
    search?: Record<string, string>;
}): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`{     label: string | React.ReactNode;     id?: string;     href?: string;     disabled?: boolean;     search?: Record&#60;string, string&#62;; }`} />

