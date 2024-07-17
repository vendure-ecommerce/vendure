---
title: "GetEntityOrThrowOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## GetEntityOrThrowOptions

<GenerationInfo sourceFile="packages/core/src/connection/types.ts" sourceLine="10" packageName="@vendure/core" />

Options used by the <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> `getEntityOrThrow` method.

```ts title="Signature"
interface GetEntityOrThrowOptions<T = any> extends FindOneOptions<T> {
    channelId?: ID;
    retries?: number;
    retryDelay?: number;
    includeSoftDeleted?: boolean;
}
```
* Extends: <code>FindOneOptions&#60;T&#62;</code>



<div className="members-wrapper">

### channelId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />

An optional channelId to limit results to entities assigned to the given Channel. Should
only be used when getting entities that implement the <a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a> interface.
### retries

<MemberInfo kind="property" type={`number`} default={`0`}  since="1.1.0"  />

If set to a positive integer, it will retry getting the entity in case it is initially not
found.
### retryDelay

<MemberInfo kind="property" type={`number`} default={`25`}  since="1.1.0"  />

Specifies the delay in ms to wait between retries.
### includeSoftDeleted

<MemberInfo kind="property" type={`boolean`} default={`false`}  since="1.3.0"  />

If set to `true`, soft-deleted entities will be returned. Otherwise they will
throw as if they did not exist.


</div>
