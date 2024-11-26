---
title: "PurgeRule"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PurgeRule

<GenerationInfo sourceFile="packages/stellate-plugin/src/purge-rule.ts" sourceLine="49" packageName="@vendure/stellate-plugin" />

Defines a rule that listens for a particular VendureEvent and uses that to
make calls to the [Stellate Purging API](https://docs.stellate.co/docs/purging-api) via
the provided <a href='/reference/core-plugins/stellate-plugin/stellate-service#stellateservice'>StellateService</a> instance.

```ts title="Signature"
class PurgeRule<Event extends VendureEvent = VendureEvent> {
    eventType: Type<Event>
    bufferTimeMs: number | undefined
    handle(handlerArgs: { events: Event[]; stellateService: StellateService; injector: Injector }) => ;
    constructor(config: PurgeRuleConfig<Event>)
}
```

<div className="members-wrapper">

### eventType

<MemberInfo kind="property" type={`Type&#60;Event&#62;`}   />


### bufferTimeMs

<MemberInfo kind="property" type={`number | undefined`}   />


### handle

<MemberInfo kind="method" type={`(handlerArgs: { events: Event[]; stellateService: <a href='/reference/core-plugins/stellate-plugin/stellate-service#stellateservice'>StellateService</a>; injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a> }) => `}   />


### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/core-plugins/stellate-plugin/purge-rule#purgeruleconfig'>PurgeRuleConfig</a>&#60;Event&#62;) => PurgeRule`}   />




</div>


## PurgeRuleConfig

<GenerationInfo sourceFile="packages/stellate-plugin/src/purge-rule.ts" sourceLine="13" packageName="@vendure/stellate-plugin" />

Configures a <a href='/reference/core-plugins/stellate-plugin/purge-rule#purgerule'>PurgeRule</a>.

```ts title="Signature"
interface PurgeRuleConfig<Event extends VendureEvent> {
    eventType: Type<Event>;
    bufferTime?: number;
    handler: (handlerArgs: {
        events: Event[];
        stellateService: StellateService;
        injector: Injector;
    }) => void | Promise<void>;
}
```

<div className="members-wrapper">

### eventType

<MemberInfo kind="property" type={`Type&#60;Event&#62;`}   />

Specifies which VendureEvent will trigger this purge rule.
### bufferTime

<MemberInfo kind="property" type={`number`} default={`5000`}   />

How long to buffer events for in milliseconds before executing the handler. This allows
us to efficiently batch calls to the Stellate Purge API.
### handler

<MemberInfo kind="property" type={`(handlerArgs: {         events: Event[];         stellateService: <a href='/reference/core-plugins/stellate-plugin/stellate-service#stellateservice'>StellateService</a>;         injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>;     }) =&#62; void | Promise&#60;void&#62;`}   />

The function to invoke when the specified event is published. This function should use the
<a href='/reference/core-plugins/stellate-plugin/stellate-service#stellateservice'>StellateService</a> instance to call the Stellate Purge API.


</div>
