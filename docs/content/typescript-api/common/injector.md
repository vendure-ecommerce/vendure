---
title: "Injector"
weight: 10
date: 2023-07-14T16:57:49.442Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Injector
<div class="symbol">


# Injector

{{< generation-info sourceFile="packages/core/src/common/injector.ts" sourceLine="15" packageName="@vendure/core">}}

The Injector wraps the underlying Nestjs `ModuleRef`, allowing injection of providers
known to the application's dependency injection container. This is intended to enable the injection
of services into objects which exist outside of the Nestjs module system, e.g. the various
Strategies which can be supplied in the VendureConfig.

## Signature

```TypeScript
class Injector {
  constructor(moduleRef: ModuleRef)
  get(typeOrToken: Type<T> | string | symbol) => R;
  resolve(typeOrToken: Type<T> | string | symbol, contextId?: ContextId) => Promise<R>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(moduleRef: ModuleRef) => Injector"  >}}

{{< member-description >}}{{< /member-description >}}

### get

{{< member-info kind="method" type="(typeOrToken: Type&#60;T&#62; | string | symbol) => R"  >}}

{{< member-description >}}Retrieve an instance of the given type from the app's dependency injection container.
Wraps the Nestjs `ModuleRef.get()` method.{{< /member-description >}}

### resolve

{{< member-info kind="method" type="(typeOrToken: Type&#60;T&#62; | string | symbol, contextId?: ContextId) => Promise&#60;R&#62;"  >}}

{{< member-description >}}Retrieve an instance of the given scoped provider (transient or request-scoped) from the
app's dependency injection container.
Wraps the Nestjs `ModuleRef.resolve()` method.{{< /member-description >}}


</div>
