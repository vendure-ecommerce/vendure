---
title: "Running processes on the Worker"
weight: 4
showtoc: true
---

# Running processes on the Worker

This example shows how to set up a microservice running on the Worker process, as well as subscribing to events via the [EventBus]({{< relref "event-bus" >}}).

Also see the docs for [WorkerService]({{< relref "worker-service" >}}).

```TypeScript
// order-processing.controller.ts
import { asyncObservable, ID, Order, TransactionalConnection } from '@vendure/core';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProcessOrderMessage } from './process-order-message';

@Controller()
class OrderProcessingController {

  constructor(private connection: TransactionalConnection) {}

  @MessagePattern(ProcessOrderMessage.pattern)
  async processOrder({ orderId }: ProcessOrderMessage['data']) {
    const order = await this.connection.getRepository(Order).findOne(orderId);
    // ...do some expensive / slow computation
    return true;
  }

}
```
* This controller will be executed as a microservice in the [Vendure worker process]({{< relref "vendure-worker" >}}). This makes it suitable for long-running or resource-intensive tasks that you do not want to interfere with the main process which is handling GraphQL API requests.
* Messages are sent to the worker using [WorkerMessages]({{< relref "worker-message" >}}), each of which has a unique pattern and can include a payload of data sent from the main process.
* The return value of the method should correspond to the return type of the WorkerMessage (the second generic argument, `boolean` in the case of `ProcessOrderMessage` - see next snippet)

```TypeScript
// process-order-message.ts
import { ID, WorkerMessage } from '@vendure/core';

export class ProcessOrderMessage extends WorkerMessage<{ orderId: ID }, boolean> {
  static readonly pattern = 'ProcessOrder';
}
```

The `ProcessOrderMessage` is sent in response to certain events:

```TypeScript
import { OnVendureBootstrap, OrderStateTransitionEvent, PluginCommonModule, 
  VendurePlugin, WorkerService, EventBus } from '@vendure/core';
import { OrderProcessingController } from './process-order.controller';
import { ProcessOrderMessage } from './process-order-message';

@VendurePlugin({
  imports: [PluginCommonModule],
  workers: [OrderProcessingController],
})
export class OrderAnalyticsPlugin implements OnVendureBootstrap {

  constructor(
    private workerService: WorkerService,
    private eventBus: EventBus,
  ) {}
  
  /**
   * When the server bootstraps, set up a subscription for events 
   * published whenever  an Order changes state. When an Order has 
   * been fulfilled, we send a message to the controller running on
   * the Worker process to let it process that order.
   */
  onVendureBootstrap() {
    this.eventBus.ofType(OrderStateTransitionEvent).subscribe(event => {
      if (event.toState === 'Delivered') {
        this.workerService.send(new ProcessOrderMessage({ orderId: event.order.id })).subscribe();
      }
    });
  }

}
```
