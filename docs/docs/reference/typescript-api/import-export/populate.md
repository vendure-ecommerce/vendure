---
title: "Populate"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## populate

<GenerationInfo sourceFile="packages/core/src/cli/populate.ts" sourceLine="51" packageName="@vendure/core" />

Populates the Vendure server with some initial data and (optionally) product data from
a supplied CSV file. The format of the CSV file is described in the section
[Importing Product Data](/guides/developer-guide/importing-data/).

If the `channelOrToken` argument is provided, all ChannelAware entities (Products, ProductVariants,
Assets, ShippingMethods, PaymentMethods etc.) will be assigned to the specified Channel.
The argument can be either a Channel object or a valid channel `token`.

Internally the `populate()` function does the following:

1. Uses the <a href='/reference/typescript-api/import-export/populator#populator'>Populator</a> to populate the <a href='/reference/typescript-api/import-export/initial-data#initialdata'>InitialData</a>.
2. If `productsCsvPath` is provided, uses <a href='/reference/typescript-api/import-export/importer#importer'>Importer</a> to populate Product data.
3. Uses <a href='/reference/typescript-api/import-export/populator#populator'>Populator</a> to populate collections specified in the <a href='/reference/typescript-api/import-export/initial-data#initialdata'>InitialData</a>.

*Example*

```ts
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

```ts title="Signature"
function populate<T extends INestApplicationContext>(bootstrapFn: () => Promise<T | undefined>, initialDataPathOrObject: string | object, productsCsvPath?: string, channelOrToken?: string | import('@vendure/core').Channel): Promise<T>
```
Parameters

### bootstrapFn

<MemberInfo kind="parameter" type={`() =&#62; Promise&#60;T | undefined&#62;`} />

### initialDataPathOrObject

<MemberInfo kind="parameter" type={`string | object`} />

### productsCsvPath

<MemberInfo kind="parameter" type={`string`} />

### channelOrToken

<MemberInfo kind="parameter" type={`string | import('@vendure/core').<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>`} />

