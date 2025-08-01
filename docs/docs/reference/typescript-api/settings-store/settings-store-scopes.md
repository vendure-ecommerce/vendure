---
title: "SettingsStoreScopes"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SettingsStoreScopes

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="144" packageName="@vendure/core" since="3.4.0" />

Pre-built scope functions for common scoping patterns.

*Example*

```ts
const config: VendureConfig = {
  settingsStoreFields: {
    dashboard: [
      {
        name: 'theme',
        scope: SettingsStoreScopes.user, // User-specific
      },
      {
        name: 'currency',
        scope: SettingsStoreScopes.channel, // Channel-specific
      },
      {
        name: 'tableFilters',
        scope: SettingsStoreScopes.userAndChannel, // User-specific per channel
      }
    ]
  }
};
```

