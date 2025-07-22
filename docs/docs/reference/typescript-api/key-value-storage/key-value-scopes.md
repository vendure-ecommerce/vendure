---
title: "KeyValueScopes"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## KeyValueScopes

<GenerationInfo sourceFile="packages/core/src/config/key-value/key-value-types.ts" sourceLine="140" packageName="@vendure/core" since="3.4.0" />

Pre-built scope functions for common scoping patterns.

*Example*

```ts
const config: VendureConfig = {
  keyValueFields: {
    dashboard: [
      {
        name: 'theme',
        scope: KeyValueScopes.user, // User-specific
      },
      {
        name: 'currency',
        scope: KeyValueScopes.channel, // Channel-specific
      },
      {
        name: 'tableFilters',
        scope: KeyValueScopes.userAndChannel, // User-specific per channel
      }
    ]
  }
};
```

