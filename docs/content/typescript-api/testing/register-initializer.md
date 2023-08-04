---
title: "RegisterInitializer"
weight: 10
date: 2023-07-14T16:57:50.807Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# registerInitializer
<div class="symbol">


# registerInitializer

{{< generation-info sourceFile="packages/testing/src/initializers/initializers.ts" sourceLine="16" packageName="@vendure/testing">}}

Registers a <a href='/typescript-api/testing/test-db-initializer#testdbinitializer'>TestDbInitializer</a> for the given database type. Should be called before invoking
<a href='/typescript-api/testing/create-test-environment#createtestenvironment'>createTestEnvironment</a>.

## Signature

```TypeScript
function registerInitializer(type: DataSourceOptions['type'], initializer: TestDbInitializer<any>): void
```
## Parameters

### type

{{< member-info kind="parameter" type="DataSourceOptions['type']" >}}

### initializer

{{< member-info kind="parameter" type="<a href='/typescript-api/testing/test-db-initializer#testdbinitializer'>TestDbInitializer</a>&#60;any&#62;" >}}

</div>
