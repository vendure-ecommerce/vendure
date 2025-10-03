---
title: "UsePageBlock"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## usePageBlock

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-page-block.tsx" sourceLine="21" packageName="@vendure/dashboard" since="3.3.0" />

Returns the current PageBlock context, which means there must be
a PageBlock ancestor component higher in the tree.

If `optional` is set to true, the hook will not throw if no PageBlock
exists higher in the tree, but will just return undefined.

*Example*

```tsx
const { blockId, title, description, column } = usePageBlock();
```

```ts title="Signature"
function usePageBlock(props: { optional?: boolean } = {}): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`{ optional?: boolean }`} />

