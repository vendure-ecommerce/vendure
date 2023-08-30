---
title: "Populate"
weight: 10
date: 2023-07-14T16:57:49.413Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# populate
<div class="symbol">


# populate

{{< generation-info sourceFile="packages/core/src/cli/populate.ts" sourceLine="51" packageName="@vendure/core">}}

Populates the Vendure server with some initial data and (optionally) product data from
a supplied CSV file. The format of the CSV file is described in the section
[Importing Product Data](/docs/developer-guide/importing-product-data).

If the `channelOrToken` argument is provided, all ChannelAware entities (Products, ProductVariants,
Assets, ShippingMethods, PaymentMethods etc.) will be assigned to the specified Channel.
The argument can be either a Channel object or a valid channel `token`.

Internally the `populate()` function does the following:

1. Uses the <a href='/typescript-api/import-export/populator#populator'>Populator</a> to populate the <a href='/typescript-api/import-export/initial-data#initialdata'>InitialData</a>.
2. If `productsCsvPath` is provided, uses <a href='/typescript-api/import-export/importer#importer'>Importer</a> to populate Product data.
3. Uses {@Populator} to populate collections specified in the <a href='/typescript-api/import-export/initial-data#initialdata'>InitialData</a>.

*Example*

```TypeScript
import { bootstrap } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import { config } from './vendure-config.ts'
import { initialData } from './my-initial-data.ts';

const productsCsvFile = path.join(__dirname, 'path/to/products.csv')

populate(
  () => bootstrap(config),
  initialData,
  productsCsvFile,
)
.then(app => app.close())
.then(
  () => process.exit(0),
  err => {
    console.log(err);
    process.exit(1);
  },
);
```

## Signature

```TypeScript
function populate<T extends INestApplicationContext>(bootstrapFn: () => Promise<T | undefined>, initialDataPathOrObject: string | object, productsCsvPath?: string, channelOrToken?: string | import('@vendure/core').Channel): Promise<T>
```
## Parameters

### bootstrapFn

{{< member-info kind="parameter" type="() =&#62; Promise&#60;T | undefined&#62;" >}}

### initialDataPathOrObject

{{< member-info kind="parameter" type="string | object" >}}

### productsCsvPath

{{< member-info kind="parameter" type="string" >}}

### channelOrToken

{{< member-info kind="parameter" type="string | import('@vendure/core').<a href='/typescript-api/entities/channel#channel'>Channel</a>" >}}

</div>
