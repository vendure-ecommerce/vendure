---
title: "CdsIcon"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CdsIcon

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-components/CdsIcon.tsx" sourceLine="47" packageName="@vendure/admin-ui" />

A React wrapper for the Clarity UI icon component.

*Example*

```ts
import { userIcon } from '@cds/core/icon';
import { CdsIcon } from '@vendure/admin-ui/react';

registerCdsIcon(userIcon);
export function MyComponent() {
   return <CdsIcon icon={userIcon} badge="warning" solid size="lg"></CdsIcon>;
}
```

```ts title="Signature"
function CdsIcon(props: { icon: IconShapeTuple; className?: string } & Partial<CdsIconProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`{ icon: IconShapeTuple; className?: string } &#38; Partial&#60;CdsIconProps&#62;`} />

