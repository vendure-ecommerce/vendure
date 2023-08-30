---
title: "TestDbInitializer"
weight: 10
date: 2023-07-14T16:57:50.808Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TestDbInitializer
<div class="symbol">


# TestDbInitializer

{{< generation-info sourceFile="packages/testing/src/initializers/test-db-initializer.ts" sourceLine="23" packageName="@vendure/testing">}}

Defines how the e2e TestService sets up a particular DB to run a single test suite.
The `@vendure/testing` package ships with initializers for sql.js, MySQL & Postgres.

Custom initializers can be created by implementing this interface and registering
it with the <a href='/typescript-api/testing/register-initializer#registerinitializer'>registerInitializer</a> function:

*Example*

```TypeScript
export class CockroachDbInitializer implements TestDbInitializer<CockroachConnectionOptions> {
    // database-specific implementation goes here
}

registerInitializer('cockroachdb', new CockroachDbInitializer());
```

## Signature

```TypeScript
interface TestDbInitializer<T extends BaseConnectionOptions> {
  init(testFileName: string, connectionOptions: T): Promise<T>;
  populate(populateFn: () => Promise<void>): Promise<void>;
  destroy(): void | Promise<void>;
}
```
## Members

### init

{{< member-info kind="method" type="(testFileName: string, connectionOptions: T) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Responsible for creating a database for the current test suite.
Typically, this method will:

* use the testFileName parameter to derive a database name
* create the database
* mutate the `connetionOptions` object to point to that new database{{< /member-description >}}

### populate

{{< member-info kind="method" type="(populateFn: () =&#62; Promise&#60;void&#62;) => Promise&#60;void&#62;"  >}}

{{< member-description >}}Execute the populateFn to populate your database.{{< /member-description >}}

### destroy

{{< member-info kind="method" type="() => void | Promise&#60;void&#62;"  >}}

{{< member-description >}}Clean up any resources used during the init() phase (i.e. close open DB connections){{< /member-description >}}


</div>
