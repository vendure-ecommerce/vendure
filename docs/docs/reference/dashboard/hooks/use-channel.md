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

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-channel.ts" sourceLine="19" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

Provides access to the <a href='/reference/dashboard/hooks/use-channel#channelcontext'>ChannelContext</a> which contains information
about the active channel.

```ts title="Signature"
function useChannel(): void
```


## ChannelContext

<GenerationInfo sourceFile="packages/dashboard/src/lib/providers/channel-provider.tsx" sourceLine="53" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

```ts title="Signature"
interface ChannelContext {
    activeChannel: ActiveChannel | undefined;
    channels: Channel[];
    selectedChannelId: string | undefined;
    selectedChannel: Channel | undefined;
    isLoading: boolean;
    setSelectedChannel: (channelId: string) => void;
}
```

<div className="members-wrapper">

### activeChannel

<MemberInfo kind="property" type={`ActiveChannel | undefined`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### selectedChannelId

<MemberInfo kind="property" type={`string | undefined`}   />


### selectedChannel

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a> | undefined`}   />


### isLoading

<MemberInfo kind="property" type={`boolean`}   />


### setSelectedChannel

<MemberInfo kind="property" type={`(channelId: string) =&#62; void`}   />




</div>
