---
title: "RegisterInitializer"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerInitializer

<GenerationInfo sourceFile="packages/testing/src/initializers/initializers.ts" sourceLine="16" packageName="@vendure/testing" />

Registers a <a href='/reference/typescript-api/testing/test-db-initializer#testdbinitializer'>TestDbInitializer</a> for the given database type. Should be called before invoking
<a href='/reference/typescript-api/testing/create-test-environment#createtestenvironment'>createTestEnvironment</a>.

```ts title="Signature"
function registerInitializer(type: DataSourceOptions['type'], initializer: TestDbInitializer<any>): void
```
Parameters

### type

<MemberInfo kind="parameter" type={`DataSourceOptions['type']`} />

### initializer

<MemberInfo kind="parameter" type={`<a href='/reference/typescript-api/testing/test-db-initializer#testdbinitializer'>TestDbInitializer</a>&#60;any&#62;`} />

