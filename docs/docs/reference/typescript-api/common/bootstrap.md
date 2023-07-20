---
title: "Bootstrap"
weight: 10
date: 2023-07-20T13:56:14.151Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## bootstrap

<GenerationInfo sourceFile="packages/core/src/bootstrap.ts" sourceLine="44" packageName="@vendure/core" />

Bootstraps the Vendure server. This is the entry point to the application.

*Example*

```TypeScript
import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';

bootstrap(config).catch(err => {
    console.log(err);
});
```

```ts title="Signature"
function bootstrap(userConfig: Partial<VendureConfig>): Promise<INestApplication>
```
Parameters

### userConfig

<MemberInfo kind="parameter" type="Partial&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;" />

