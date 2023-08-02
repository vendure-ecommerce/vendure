---
title: "MigrationOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## MigrationOptions

<GenerationInfo sourceFile="packages/core/src/migrate.ts" sourceLine="19" packageName="@vendure/core" />

Configuration for generating a new migration script via <a href='/reference/typescript-api/migration/generate-migration#generatemigration'>generateMigration</a>.

```ts title="Signature"
interface MigrationOptions {
    name: string;
    outputDir?: string;
}
```

<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`}   />

The name of the migration. The resulting migration script will be named
`{TIMESTAMP}-{name}.ts`.
### outputDir

<MemberInfo kind="property" type={`string`}   />

The output directory of the generated migration scripts.


</div>
