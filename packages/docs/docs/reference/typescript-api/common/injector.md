---
title: "Injector"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Injector

<GenerationInfo sourceFile="packages/core/src/common/injector.ts" sourceLine="15" packageName="@vendure/core" />

The Injector wraps the underlying Nestjs `ModuleRef`, allowing injection of providers
known to the application's dependency injection container. This is intended to enable the injection
of services into objects which exist outside of the Nestjs module system, e.g. the various
Strategies which can be supplied in the VendureConfig.

```ts title="Signature"
class Injector {
    constructor(moduleRef: ModuleRef)
    get(typeOrToken: Type<T> | string | symbol) => R;
    resolve(typeOrToken: Type<T> | string | symbol, contextId?: ContextId) => Promise<R>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(moduleRef: ModuleRef) => Injector`}   />


### get

<MemberInfo kind="method" type={`(typeOrToken: Type&#60;T&#62; | string | symbol) => R`}   />

Retrieve an instance of the given type from the app's dependency injection container.
Wraps the Nestjs `ModuleRef.get()` method.
### resolve

<MemberInfo kind="method" type={`(typeOrToken: Type&#60;T&#62; | string | symbol, contextId?: ContextId) => Promise&#60;R&#62;`}   />

Retrieve an instance of the given scoped provider (transient or request-scoped) from the
app's dependency injection container.
Wraps the Nestjs `ModuleRef.resolve()` method.


</div>
