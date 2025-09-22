---
title: "UseChannel"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useChannel

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-channel.ts" sourceLine="21" packageName="@vendure/dashboard" since="3.3.0" />

Provides access to the <a href='/reference/dashboard/hooks/use-channel#channelcontext'>ChannelContext</a> which contains information
about the active channel.

*Example*

```tsx
const { activeChannel } = useChannel();
```

```ts title="Signature"
function useChannel(): void
```


## ChannelContext

<GenerationInfo sourceFile="packages/dashboard/src/lib/providers/channel-provider.tsx" sourceLine="63" packageName="@vendure/dashboard" since="3.3.0" />

Provides information about the active channel, and the means to set a new
active channel.

```ts title="Signature"
interface ChannelContext {
    isLoading: boolean;
    channels: Channel[];
    activeChannel: ActiveChannel | undefined;
    setActiveChannel: (channelId: string) => void;
    refreshChannels: () => void;
}
```

<div className="members-wrapper">

### isLoading

<MemberInfo kind="property" type={`boolean`}   />

Whether the channels are loading.
### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />

An array of all available channels.
### activeChannel

<MemberInfo kind="property" type={`ActiveChannel | undefined`}   />

The active channel.
### setActiveChannel

<MemberInfo kind="property" type={`(channelId: string) =&#62; void`}   />

The function to set the active channel.
### refreshChannels

<MemberInfo kind="property" type={`() =&#62; void`}   />

The function to refresh the channels.


</div>
