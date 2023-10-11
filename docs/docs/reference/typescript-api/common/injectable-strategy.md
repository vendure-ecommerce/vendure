---
title: "InjectableStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## InjectableStrategy

<GenerationInfo sourceFile="packages/core/src/common/types/injectable-strategy.ts" sourceLine="10" packageName="@vendure/core" />

This interface defines the setup and teardown hooks available to the
various strategies used to configure Vendure.

```ts title="Signature"
interface InjectableStrategy {
    init?: (injector: Injector) => void | Promise<void>;
    destroy?: () => void | Promise<void>;
}
```

<div className="members-wrapper">

### init

<MemberInfo kind="property" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) =&#62; void | Promise&#60;void&#62;`}   />

Defines setup logic to be run during application bootstrap. Receives
the <a href='/reference/typescript-api/common/injector#injector'>Injector</a> as an argument, which allows application providers
to be used as part of the setup. This hook will be called on both the
main server and the worker processes.

*Example*

```ts
async init(injector: Injector) {
  const myService = injector.get(MyService);
  await myService.doSomething();
}
```
### destroy

<MemberInfo kind="property" type={`() =&#62; void | Promise&#60;void&#62;`}   />

Defines teardown logic to be run before application shutdown.


</div>
