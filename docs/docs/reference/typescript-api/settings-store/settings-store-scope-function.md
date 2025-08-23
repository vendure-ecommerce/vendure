---
title: "SettingsStoreScopeFunction"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SettingsStoreScopeFunction

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="27" packageName="@vendure/core" since="3.4.0" />

A function that determines how a settings store entry should be scoped.
Returns a string that will be used as the scope key for storage isolation.

*Example*

```ts
// User-specific scoping
const userScope: SettingsStoreScopeFunction = ({ ctx }) => ctx.activeUserId || '';

// Channel-specific scoping
const channelScope: SettingsStoreScopeFunction = ({ ctx }) => ctx.channelId || '';

// User and channel scoping
const userAndChannelScope: SettingsStoreScopeFunction = ({ ctx }) =>
  `${ctx.activeUserId || ''}:${ctx.channelId || ''}`;
```

```ts title="Signature"
type SettingsStoreScopeFunction = (params: {
    key: string;
    value?: any;
    ctx: RequestContext;
}) => string
```
