---
title: "Stand-alone CLI Scripts"
---

# Stand-alone CLI Scripts

It is possible to create stand-alone scripts that can be run from the command-line by using the [bootstrapWorker function](/reference/typescript-api/worker/bootstrap-worker/). This can be useful for a variety of use-cases such as running cron jobs or importing data.

## Minimal example

Here's a minimal example of a script which will bootstrap the Vendure Worker and then log the number of products in the database:

```ts title="src/get-product-count.ts"
import { bootstrapWorker, Logger, ProductService, RequestContextService } from '@vendure/core';

import { config } from './vendure-config';

if (require.main === module) {
    getProductCount()
        .then(() => process.exit(0))
        .catch(err => {
            Logger.error(err);
            process.exit(1);
        });
}

async function getProductCount() {
    // This will bootstrap an instance of the Vendure Worker, providing
    // us access to all of the services defined in the Vendure core.
    // (but without the unnecessary overhead of the API layer).
    const { app } = await bootstrapWorker(config);

    // Using `app.get()` we can grab an instance of _any_ provider defined in the
    // Vendure core as well as by our plugins.
    const productService = app.get(ProductService);

    // For most service methods, we'll need to pass a RequestContext object.
    // We can use the RequestContextService to create one.
    const ctx = await app.get(RequestContextService).create({
        apiType: 'admin',
    });

    // We use the `findAll()` method to get the total count. Since we aren't
    // interested in the actual product objects, we can set the `take` option to 0.
    const { totalItems } = await productService.findAll(ctx, {take: 0});

    Logger.info(
        [
            '\n-----------------------------',
            `There are ${totalItems} products`,
            '------------------------------',
        ].join('\n'),
    )
}
``` 

This script can then be run from the command-line:

```shell
npx ts-node src/get-product-count.ts

# or

yarn ts-node src/get-product-count.ts
```

resulting in the following output:

```shell
info 01/08/23, 11:50 - [Vendure Worker] Bootstrapping Vendure Worker (pid: 4428)...
info 01/08/23, 11:50 - [Vendure Worker] Vendure Worker is ready
info 01/08/23, 11:50 - [Vendure Worker]
-----------------------------------------
There are 56 products in the database
-----------------------------------------
```

## The `app` object

The `app` object returned by the `bootstrapWorker()` function is an instance of the [NestJS Application Context](https://docs.nestjs.com/standalone-applications). It has full access to the NestJS dependency injection container, which means that you can use the `app.get()` method to retrieve any of the services defined in the Vendure core or by any plugins.

```ts title="src/import-customer-data.ts"
import { bootstrapWorker, CustomerService } from '@vendure/core';
import { config } from './vendure-config';

// ...

async function importCustomerData() {
    const { app } = await bootstrapWorker(config);
    
    // highlight-start
    const customerService = app.get(CustomerService);
    // highlight-end
}
```

## Creating a RequestContext

Almost all the methods exposed by Vendure's core services take a `RequestContext` object as the first argument. Usually, this object is created in the [API Layer](/guides/developer-guide/the-api-layer/#resolvers) by the `@Ctx()` decorator, and contains information related to the current API request.

When running a stand-alone script, we aren't making any API requests, so we need to create a `RequestContext` object manually. This can be done using the [`RequestContextService`](/reference/typescript-api/request/request-context-service/):

```ts title="src/get-product-count.ts"
// ...
import { RequestContextService } from '@vendure/core';

async function getProductCount() {
    const { app } = await bootstrapWorker(config);
    const productService = app.get(ProductService);
    
    // highlight-start
    const ctx = await app.get(RequestContextService).create({
        apiType: 'admin',
    });
    // highlight-end
    
    const { totalItems } = await productService.findAll(ctx, {take: 0});
}
```
