---
title: "Plugin Lifecycle"
weight: 3
---

# Plugin Lifecycle

Since a VendurePlugin is built on top of the Nestjs module system, any plugin (as well as any providers it defines) can make use of any of the [Nestjs lifecycle hooks](https://docs.nestjs.com/fundamentals/lifecycle-events):

* onModuleInit
* onApplicationBootstrap
* onModuleDestroy
* beforeApplicationShutdown
* onApplicationShutdown

Note that lifecycle hooks are run in _both_ the server and worker contexts.

## Configure

Another hook which is not strictly a lifecycle hook, but which can be useful to know is the [`configure` method](https://docs.nestjs.com/middleware#applying-middleware) which is used by NestJS to apply middleware. This method is called _only_ for the server and _not_ for the worker, since middleware relates to the network stack, and the worker has no network part.

## Example

```TypeScript
import { MiddlewareConsumer, NestModule, OnApplicationBootstrap } from '@nestjs/common';
import { EventBus, PluginCommonModule, VendurePlugin } from '@vendure/core';

@VendurePlugin({
    imports: [PluginCommonModule]
})
export class MyPlugin implements OnApplicationBootstrap, NestModule {

  constructor(private eventBus: EventBus) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MyMiddleware)
      .forRoutes('my-custom-route');
  }

  async onApplicationBootstrap() {
    await myAsyncInitFunction();

    this.eventBus
      .ofType(OrderStateTransitionEvent)
      .subscribe((event) => {
        // do some action when this event fires
      });
  }
}
```
