---
title: "Add a REST endpoint"
showtoc: true
---

REST-style endpoints can be defined as part of a [plugin](/guides/developer-guide/plugins/).

:::info
REST endpoints are implemented as NestJS Controllers. For comprehensive documentation, see the [NestJS controllers documentation](https://docs.nestjs.com/controllers).
:::

In this guide we will define a plugin that adds a single REST endpoint at `http://localhost:3000/products` which returns a list of all products.

## Create a controller

First let's define the controller:

```ts title="src/plugins/rest-plugin/api/products.controller.ts"
// products.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Ctx, ProductService, RequestContext } from '@vendure/core';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService) {
    }

    @Get()
    findAll(@Ctx() ctx: RequestContext) {
        return this.productService.findAll(ctx);
    }
}
```

The key points to note here are:

- The `@Controller()` decorator defines the base path for all endpoints defined in this controller. In this case, all endpoints will be prefixed with `/products`.
- The `@Get()` decorator defines a GET endpoint at the base path. The method name `findAll` is arbitrary.
- The `@Ctx()` decorator injects the [RequestContext](/reference/typescript-api/request/request-context/) which is required for all service methods.

## Register the controller with the plugin

```ts title="src/plugins/rest-plugin/rest.plugin.ts"
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductsController } from './api/products.controller';

@VendurePlugin({
  imports: [PluginCommonModule],
  controllers: [ProductsController],
})
export class RestPlugin {}
```

:::info
**Note:** [The `PluginCommonModule`](/reference/typescript-api/plugin/plugin-common-module/) should be imported to gain access to Vendure core providers - in this case it is required in order to be able to inject `ProductService` into our controller.
:::

The plugin can then be added to the `VendureConfig`:

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';
import { RestPlugin } from './plugins/rest-plugin/rest.plugin';

export const config: VendureConfig = {
    // ...
    plugins: [
        // ...
        // highlight-next-line
        RestPlugin,
    ],
};
```

## Controlling access to REST endpoints

You can use the [`@Allow()` decorator](/reference/typescript-api/request/allow-decorator/) to declare the permissions required to access a REST endpoint:

```ts title="src/plugins/rest-plugin/api/products.controller.ts"
import { Controller, Get } from '@nestjs/common';
import { Allow, Permission, Ctx, ProductService, RequestContext } from '@vendure/core';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService) {}

    // highlight-next-line
    @Allow(Permission.ReadProduct)
    @Get()
    findAll(@Ctx() ctx: RequestContext) {
        return this.productService.findAll(ctx);
    }
}
```

:::tip
The following Vendure [API decorators](/guides/developer-guide/the-api-layer/#api-decorators) can also be used with NestJS controllers: `@Allow()`, `@Transaction()`, `@Ctx()`.

Additionally, NestJS supports a number of other REST decorators detailed in the [NestJS controllers guide](https://docs.nestjs.com/controllers#request-object)
:::
