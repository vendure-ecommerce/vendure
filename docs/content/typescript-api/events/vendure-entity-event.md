---
title: "VendureEntityEvent"
weight: 10
date: 2023-07-14T16:57:50.124Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# VendureEntityEvent
<div class="symbol">


# VendureEntityEvent

{{< generation-info sourceFile="packages/core/src/event-bus/vendure-entity-event.ts" sourceLine="13" packageName="@vendure/core">}}

The base class for all entity events used by the EventBus system.
* For event type `'updated'` the entity is the one before applying the patch (if not documented otherwise).
* For event type `'deleted'` the input will most likely be an `id: ID`

## Signature

```TypeScript
class VendureEntityEvent<Entity, Input = any> extends VendureEvent {
  public readonly public readonly entity: Entity;
  public readonly public readonly type: 'created' | 'updated' | 'deleted';
  public readonly public readonly ctx: RequestContext;
  public readonly public readonly input?: Input;
  constructor(entity: Entity, type: 'created' | 'updated' | 'deleted', ctx: RequestContext, input?: Input)
}
```
## Extends

 * <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>


## Members

### entity

{{< member-info kind="property" type="Entity"  >}}

{{< member-description >}}{{< /member-description >}}

### type

{{< member-info kind="property" type="'created' | 'updated' | 'deleted'"  >}}

{{< member-description >}}{{< /member-description >}}

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### input

{{< member-info kind="property" type="Input"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(entity: Entity, type: 'created' | 'updated' | 'deleted', ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input?: Input) => VendureEntityEvent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
