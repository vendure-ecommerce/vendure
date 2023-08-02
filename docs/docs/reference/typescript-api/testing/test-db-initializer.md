---
title: "TestDbInitializer"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TestDbInitializer

<GenerationInfo sourceFile="packages/testing/src/initializers/test-db-initializer.ts" sourceLine="23" packageName="@vendure/testing" />

Defines how the e2e TestService sets up a particular DB to run a single test suite.
The `@vendure/testing` package ships with initializers for sql.js, MySQL & Postgres.

Custom initializers can be created by implementing this interface and registering
it with the <a href='/reference/typescript-api/testing/register-initializer#registerinitializer'>registerInitializer</a> function:

*Example*

```ts
export class CockroachDbInitializer implements TestDbInitializer<CockroachConnectionOptions> {
    // database-specific implementation goes here
}

registerInitializer('cockroachdb', new CockroachDbInitializer());
```

```ts title="Signature"
interface TestDbInitializer<T extends BaseConnectionOptions> {
    init(testFileName: string, connectionOptions: T): Promise<T>;
    populate(populateFn: () => Promise<void>): Promise<void>;
    destroy(): void | Promise<void>;
}
```

<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(testFileName: string, connectionOptions: T) => Promise&#60;T&#62;`}   />

Responsible for creating a database for the current test suite.
Typically, this method will:

* use the testFileName parameter to derive a database name
* create the database
* mutate the `connetionOptions` object to point to that new database
### populate

<MemberInfo kind="method" type={`(populateFn: () =&#62; Promise&#60;void&#62;) => Promise&#60;void&#62;`}   />

Execute the populateFn to populate your database.
### destroy

<MemberInfo kind="method" type={`() => void | Promise&#60;void&#62;`}   />

Clean up any resources used during the init() phase (i.e. close open DB connections)


</div>
