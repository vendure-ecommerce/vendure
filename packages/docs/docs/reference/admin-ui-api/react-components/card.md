---
title: "Card"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Card

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-components/Card.tsx" sourceLine="22" packageName="@vendure/admin-ui" />

A card component which can be used to group related content.

*Example*

```ts
import { Card } from '@vendure/admin-ui/react';

export function MyComponent() {
  return (
    <Card title='My Title'>
      <p>Some content</p>
    </Card>
  );
}
```

```ts title="Signature"
function Card(props: PropsWithChildren<{ title?: string; paddingX?: boolean }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`PropsWithChildren&#60;{ title?: string; paddingX?: boolean }&#62;`} />

