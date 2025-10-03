---
title: "UsePermissions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## usePermissions

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-permissions.ts" sourceLine="23" packageName="@vendure/dashboard" since="3.3.0" />

Returns a `hasPermissions` function that can be used to determine whether the active user
has the given permissions on the active channel.

*Example*

```tsx
const { hasPermissions } = usePermissions();

const canReadChannel = hasPermissions(['ReadChannel']);
```

```ts title="Signature"
function usePermissions(): void
```
