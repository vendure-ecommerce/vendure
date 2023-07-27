---
title: "GenerateMigration"
weight: 10
date: 2023-07-14T16:57:50.192Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# generateMigration
<div class="symbol">


# generateMigration

{{< generation-info sourceFile="packages/core/src/migrate.ts" sourceLine="107" packageName="@vendure/core">}}

Generates a new migration file based on any schema changes (e.g. adding or removing CustomFields).
See [TypeORM migration docs](https://typeorm.io/#/migrations) for more information about the
underlying migration mechanism.

## Signature

```TypeScript
function generateMigration(userConfig: Partial<VendureConfig>, options: MigrationOptions): void
```
## Parameters

### userConfig

{{< member-info kind="parameter" type="Partial&#60;<a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>&#62;" >}}

### options

{{< member-info kind="parameter" type="<a href='/typescript-api/migration/migration-options#migrationoptions'>MigrationOptions</a>" >}}

</div>
