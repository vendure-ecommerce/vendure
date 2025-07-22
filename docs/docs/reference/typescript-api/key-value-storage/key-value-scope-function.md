---
title: "KeyValueScopeFunction"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## KeyValueScopeFunction

<GenerationInfo sourceFile="packages/core/src/config/key-value/key-value-types.ts" sourceLine="27" packageName="@vendure/core" since="3.4.0" />

A function that determines how a key-value entry should be scoped.
Returns a string that will be used as the scope key for storage isolation.

*Example*

```ts
// User-specific scoping
const userScope: KeyValueScopeFunction = ({ ctx }) => ctx.activeUserId || '';

// Channel-specific scoping
const channelScope: KeyValueScopeFunction = ({ ctx }) => ctx.channelId || '';

// User and channel scoping
const userAndChannelScope: KeyValueScopeFunction = ({ ctx }) =>
  `${ctx.activeUserId || ''}:${ctx.channelId || ''}`;
```

```ts title="Signature"
type KeyValueScopeFunction = (params: { key: string; value?: any; ctx: RequestContext }) => string
```
