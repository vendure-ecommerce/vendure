---
title: "PageDetailLayout"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PageDetailLayout

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-components/PageDetailLayout.tsx" sourceLine="22" packageName="@vendure/admin-ui" />

A responsive container for detail views with a main content area and an optional sidebar.

*Example*

```ts
import { PageDetailLayout } from '@vendure/admin-ui/react';

export function MyComponent() {
  return (
    <PageDetailLayout sidebar={<div>Sidebar content</div>}>
      <div>Main content</div>
    </PageDetailLayout>
  );
}
```

```ts title="Signature"
function PageDetailLayout(props: PropsWithChildren<{ sidebar?: ReactNode }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`PropsWithChildren&#60;{ sidebar?: ReactNode }&#62;`} />

