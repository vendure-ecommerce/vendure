---
title: "VendurePlugin"
weight: 10
date: 2023-07-14T16:57:50.216Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# VendurePlugin
<div class="symbol">


# VendurePlugin

{{< generation-info sourceFile="packages/core/src/plugin/vendure-plugin.ts" sourceLine="151" packageName="@vendure/core">}}

The VendurePlugin decorator is a means of configuring and/or extending the functionality of the Vendure server. A Vendure plugin is
a [Nestjs Module](https://docs.nestjs.com/modules), with optional additional metadata defining things like extensions to the GraphQL API, custom
configuration or new database entities.

As well as configuring the app, a plugin may also extend the GraphQL schema by extending existing types or adding
entirely new types. Database entities and resolvers can also be defined to handle the extended GraphQL types.

*Example*

```TypeScript
import { Controller, Get } from '@nestjs/common';
import { Ctx, PluginCommonModule, ProductService, RequestContext, VendurePlugin } from '@vendure/core';

@Controller('products')
export class ProductsController {
    constructor(private productService: ProductService) {}

    @Get()
    findAll(@Ctx() ctx: RequestContext) {
        return this.productService.findAll(ctx);
    }
}


//A simple plugin which adds a REST endpoint for querying products.
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [ProductsController],
})
export class RestPlugin {}
```

## Signature

```TypeScript
function VendurePlugin(pluginMetadata: VendurePluginMetadata): ClassDecorator
```
## Parameters

### pluginMetadata

{{< member-info kind="parameter" type="<a href='/typescript-api/plugin/vendure-plugin-metadata#vendurepluginmetadata'>VendurePluginMetadata</a>" >}}

</div>
