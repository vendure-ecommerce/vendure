---
title: "VendureEntityEvent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## VendureEntityEvent

<GenerationInfo sourceFile="packages/core/src/event-bus/vendure-entity-event.ts" sourceLine="12" packageName="@vendure/core" />

The base class for all entity events used by the EventBus system.
* For event type `'deleted'` the input will most likely be an `id: ID`

```ts title="Signature"
class VendureEntityEvent<Entity, Input = any> extends VendureEvent {
    public readonly entity: Entity;
    public readonly type: 'created' | 'updated' | 'deleted';
    public readonly ctx: RequestContext;
    public readonly input?: Input;
    constructor(entity: Entity, type: 'created' | 'updated' | 'deleted', ctx: RequestContext, input?: Input)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### entity

<MemberInfo kind="property" type={`Entity`}   />


### type

<MemberInfo kind="property" type={`'created' | 'updated' | 'deleted'`}   />


### ctx

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />


### input

<MemberInfo kind="property" type={`Input`}   />


### constructor

<MemberInfo kind="method" type={`(entity: Entity, type: 'created' | 'updated' | 'deleted', ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input?: Input) => VendureEntityEvent`}   />




</div>
