---
title: "MigrationOptions"
weight: 10
date: 2023-07-14T16:57:50.190Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# MigrationOptions
<div class="symbol">


# MigrationOptions

{{< generation-info sourceFile="packages/core/src/migrate.ts" sourceLine="19" packageName="@vendure/core">}}

Configuration for generating a new migration script via <a href='/typescript-api/migration/generate-migration#generatemigration'>generateMigration</a>.

## Signature

```TypeScript
interface MigrationOptions {
  name: string;
  outputDir?: string;
}
```
## Members

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the migration. The resulting migration script will be named
`{TIMESTAMP}-{name}.ts`.{{< /member-description >}}

### outputDir

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The output directory of the generated migration scripts.{{< /member-description >}}


</div>
