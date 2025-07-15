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

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-permissions.ts" sourceLine="18" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Returns a `hasPermissions` function that can be used to determine whether the active user
has the given permissions on the active channel.

```ts title="Signature"
function usePermissions(): void
```
