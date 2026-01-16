---
title: "GenerateMigration"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## generateMigration

<GenerationInfo sourceFile="packages/core/src/migrate.ts" sourceLine="118" packageName="@vendure/core" />

Generates a new migration file based on any schema changes (e.g. adding or removing CustomFields).
See [TypeORM migration docs](https://typeorm.io/#/migrations) for more information about the
underlying migration mechanism.

```ts title="Signature"
function generateMigration(userConfig: Partial<VendureConfig>, options: MigrationOptions): Promise<string | undefined>
```
Parameters

### userConfig

<MemberInfo kind="parameter" type={`Partial&#60;<a href='/reference/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;`} />

### options

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/migration/migration-options#migrationoptions'>MigrationOptions</a>`} />

