---
title: "Database subscribers"
---

# Defining database subscribers

TypeORM allows us to define [subscribers](https://typeorm.io/listeners-and-subscribers#what-is-a-subscriber). With a subscriber, we can listen to specific entity events and take actions based on inserts, updates, deletions and more.

If you need lower-level access to database changes that you get with the [Vendure EventBus system](/reference/typescript-api/events/event-bus/), TypeORM subscribers can be useful.

## Simple subscribers

The simplest way to register a subscriber is to pass it to the `dbConnectionOptions.subscribers` array:

```ts title="src/plugins/my-plugin/product-subscriber.ts"
import { Product, VendureConfig } from '@vendure/core';
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }
  
  beforeUpdate(event: UpdateEvent<Product>) {
    console.log(`BEFORE PRODUCT UPDATED: `, event.entity);
  }
}
```

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';
import { ProductSubscriber } from './plugins/my-plugin/product-subscriber';

// ...
export const config: VendureConfig = {
  dbConnectionOptions: {
    // ...
    subscribers: [ProductSubscriber],
  }
}
```

The limitation of this method is that the `ProductSubscriber` class cannot make use of dependency injection, since it is not known to the underlying NestJS application and is instead instantiated by TypeORM directly.

If you need to make use of providers in your subscriber class, you'll need to use the following pattern.

## Injectable subscribers

By defining the subscriber as an injectable provider, and passing it to a Vendure plugin, you can take advantage of Nest's dependency injection inside the subscriber methods.

```ts title="src/plugins/my-plugin/product-subscriber.ts"
import {
  PluginCommonModule,
  Product,
  TransactionalConnection,
  VendureConfig,
  VendurePlugin,
} from '@vendure/core';
import { Injectable } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { MyService } from './services/my.service';

@Injectable()
@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
    constructor(private connection: TransactionalConnection,
                private myService: MyService) {
        // This is how we can dynamically register the subscriber
        // with TypeORM
        connection.rawConnection.subscribers.push(this);
    }

    listenTo() {
        return Product;
    }

    async beforeUpdate(event: UpdateEvent<Product>) {
        console.log(`BEFORE PRODUCT UPDATED: `, event.entity);
        // Now we can make use of our injected provider
        await this.myService.handleProductUpdate(event);
    }
}
```

```ts title="src/plugins/my-plugin/my.plugin.ts"
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [ProductSubscriber, MyService],
})
class MyPlugin {
}
```

```ts title="src/vendure-config.ts"
// ...
export const config: VendureConfig = {
    dbConnectionOptions: {
        // We no longer need to pass the subscriber here
        // subscribers: [ProductSubscriber],
    },
    plugins: [
        MyPlugin,
    ],
}
```

## Troubleshooting subscribers

An important factor when working with TypeORM subscribers is that they are very low-level and require some understanding of the Vendure schema.

For example consider the `ProductSubscriber` above. If an admin changes a product's name in the Admin UI, this subscriber **will not fire**. The reason is that the `name` property is actually stored on the `ProductTranslation` entity, rather than on the `Product` entity.

So if your subscribers do not seem to work as expected, check your database schema and make sure you are really targeting the correct entity which has the property that you are interested in.

