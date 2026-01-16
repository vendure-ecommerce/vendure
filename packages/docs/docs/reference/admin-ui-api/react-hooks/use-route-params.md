---
title: "UseRouteParams"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useRouteParams

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-route-params.ts" sourceLine="23" packageName="@vendure/admin-ui" />

Provides access to the current route params and query params.

*Example*

```ts
import { useRouteParams } from '@vendure/admin-ui/react';
import React from 'react';

export function MyComponent() {
    const { params, queryParams } = useRouteParams();
    // ...
    return <div>{ params.id }</div>;
}
```

```ts title="Signature"
function useRouteParams(): void
```
