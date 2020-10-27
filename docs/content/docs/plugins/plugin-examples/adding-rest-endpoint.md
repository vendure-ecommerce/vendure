---
title: "Adding a REST endpoint"
showtoc: true
---

# Adding a REST endpoint

This plugin adds a single REST endpoint at `http://localhost:3000/products` which returns a list of all Products. Find out more about [Nestjs REST Controllers](https://docs.nestjs.com/controllers).
```TypeScript
// products.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Ctx, ProductService, RequestContext } from '@vendure/core'; 

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService) {}

    @Get()
    findAll(@Ctx() ctx: RequestContext) {
        return this.productService.findAll(ctx);
    }
}
```
```TypeScript
// rest.plugin.ts
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { ProductsController } from './products.controller';

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [ProductsController],
})
export class RestPlugin {}
```

{{< alert "primary" >}}
  **Note:** [The `PluginCommonModule`]({{< relref "plugin-common-module" >}}) should be imported to gain access to Vendure core providers - in this case it is required in order to be able to inject `ProductService` into our controller.
{{< /alert >}}

Side note: since this uses no Vendure-specific metadata, it could also be written using the Nestjs `@Module()` decorator rather than the `@VendurePlugin()` decorator.
