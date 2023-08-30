---
title: "InjectableStrategy"
weight: 10
date: 2023-07-14T16:57:49.458Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# InjectableStrategy
<div class="symbol">


# InjectableStrategy

{{< generation-info sourceFile="packages/core/src/common/types/injectable-strategy.ts" sourceLine="10" packageName="@vendure/core">}}

This interface defines the setup and teardown hooks available to the
various strategies used to configure Vendure.

## Signature

```TypeScript
interface InjectableStrategy {
  init?: (injector: Injector) => void | Promise<void>;
  destroy?: () => void | Promise<void>;
}
```
## Members

### init

{{< member-info kind="property" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) =&#62; void | Promise&#60;void&#62;"  >}}

{{< member-description >}}Defines setup logic to be run during application bootstrap. Receives
the <a href='/typescript-api/common/injector#injector'>Injector</a> as an argument, which allows application providers
to be used as part of the setup. This hook will be called on both the
main server and the worker processes.

*Example*

```TypeScript
async init(injector: Injector) {
  const myService = injector.get(MyService);
  await myService.doSomething();
}
```{{< /member-description >}}

### destroy

{{< member-info kind="property" type="() =&#62; void | Promise&#60;void&#62;"  >}}

{{< member-description >}}Defines teardown logic to be run before application shutdown.{{< /member-description >}}


</div>
