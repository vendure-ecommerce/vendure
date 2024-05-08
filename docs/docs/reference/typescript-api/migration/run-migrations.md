---
title: "RunMigrations"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## runMigrations

<GenerationInfo sourceFile="packages/core/src/migrate.ts" sourceLine="40" packageName="@vendure/core" />

Runs any pending database migrations. See [TypeORM migration docs](https://typeorm.io/#/migrations)
for more information about the underlying migration mechanism.

```ts title="Signature"
function runMigrations(userConfig: Partial<VendureConfig>): Promise<string[]>
```
Parameters

### userConfig

<MemberInfo kind="parameter" type={`Partial&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;`} />

