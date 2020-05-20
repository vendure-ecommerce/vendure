---
title: "Plugin Lifecycle"
weight: 3
---

# Plugin Lifecycle

A VendurePlugin can make use of a number pre-defined "hooks", which allow the plugin to execute code at specific points during the lifecycle of the application. 

## Nestjs Lifecycle Hooks

Since a VendurePlugin is built on top of the Nestjs module system, any plugin can make use of any of the [Nestjs lifecycle hooks](https://docs.nestjs.com/fundamentals/lifecycle-events).

{{< alert "warning" >}}
Note that since a Plugin will typically be instantiated in _both_ the main process _and_ the worker, any logic defined in a Nestjs lifecycle hook will be executed **twice**. 

To run logic _only_ in the main process or worker process, use the Vendure-specific hooks below, or inject the [`ProcessContext`]({{< relref "process-context" >}}) provider.
{{< /alert >}}

## Vendure-specific hooks

Vendure defines some additional hooks which allow you to target logic depending on the context (main process or worker), as well as letting you run code _prior_ to the bootstrap process.

The available Vendure-specific lifecycle hooks are:

* [`beforeVendureBootstrap`]({{< relref "plugin-lifecycle-methods" >}}#beforevendurebootstrap) (static method)
* [`beforeVendureWorkerBootstrap`]({{< relref "plugin-lifecycle-methods" >}}#beforevendureworkerbootstrap) (static method)
* [`onVendureBootstrap`]({{< relref "plugin-lifecycle-methods" >}}#onvendurebootstrap)
* [`onVendureWorkerBootstrap`]({{< relref "plugin-lifecycle-methods" >}}#onvendureworkerbootstrap)
* [`onVendureClose`]({{< relref "plugin-lifecycle-methods" >}}#onvendureclose)
* [`onVendureWorkerClose`]({{< relref "plugin-lifecycle-methods" >}}#onvendureworkerclose)

### Example 

```TypeScript
import { OnVendureBootstrap, VendurePlugin } from '@vendure/core';

@VendurePlugin({
  // ...
})
export class MyPlugin implements OnVendureBootstrap {

  static beforeVendureBootstrap(app) {
    // An example use-case for this hook is to add 
    // global middleware as described in 
    // https://docs.nestjs.com/middleware#global-middleware
    app.use(/* ... */);
  }
  
  async onVendureBootstrap() {
    // setup logic here. If retuning a Promise, 
    // app initialization will wait until the Promise resolves.
    await myAsyncInitFunction();
  }

}
```

## Full Lifecycle Diagram

This diagram illustrates how the Nestjs & Vendure lifecycle hooks relate to one another:

{{< figure src="./plugin_lifecycle.png" >}}

