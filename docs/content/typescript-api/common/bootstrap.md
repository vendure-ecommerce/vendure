---
title: "Bootstrap"
weight: 10
date: 2023-07-14T16:57:49.412Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# bootstrap
<div class="symbol">


# bootstrap

{{< generation-info sourceFile="packages/core/src/bootstrap.ts" sourceLine="44" packageName="@vendure/core">}}

Bootstraps the Vendure server. This is the entry point to the application.

*Example*

```TypeScript
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config).catch(err => {
    console.log(err);
});
```

## Signature

```TypeScript
function bootstrap(userConfig: Partial<VendureConfig>): Promise<INestApplication>
```
## Parameters

### userConfig

{{< member-info kind="parameter" type="Partial&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;" >}}

</div>
