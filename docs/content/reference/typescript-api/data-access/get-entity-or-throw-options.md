---
title: "GetEntityOrThrowOptions"
weight: 10
date: 2023-07-14T16:57:49.798Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# GetEntityOrThrowOptions
<div class="symbol">


# GetEntityOrThrowOptions

{{< generation-info sourceFile="packages/core/src/connection/types.ts" sourceLine="10" packageName="@vendure/core">}}

Options used by the <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> `getEntityOrThrow` method.

## Signature

```TypeScript
interface GetEntityOrThrowOptions<T = any> extends FindOneOptions<T> {
  channelId?: ID;
  retries?: number;
  retryDelay?: number;
  includeSoftDeleted?: boolean;
}
```
## Extends

 * FindOneOptions&#60;T&#62;


## Members

### channelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}An optional channelId to limit results to entities assigned to the given Channel. Should
only be used when getting entities that implement the <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a> interface.{{< /member-description >}}

### retries

{{< member-info kind="property" type="number" default="0"  since="1.1.0" >}}

{{< member-description >}}If set to a positive integer, it will retry getting the entity in case it is initially not
found.{{< /member-description >}}

### retryDelay

{{< member-info kind="property" type="number" default="25"  since="1.1.0" >}}

{{< member-description >}}Specifies the delay in ms to wait between retries.{{< /member-description >}}

### includeSoftDeleted

{{< member-info kind="property" type="boolean" default="false"  since="1.3.0" >}}

{{< member-description >}}If set to `true`, soft-deleted entities will be returned. Otherwise they will
throw as if they did not exist.{{< /member-description >}}


</div>
