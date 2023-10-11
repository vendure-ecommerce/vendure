---
title: "TestServerOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TestServerOptions

<GenerationInfo sourceFile="packages/testing/src/types.ts" sourceLine="14" packageName="@vendure/testing" />

Configuration options used to initialize an instance of the <a href='/reference/typescript-api/testing/test-server#testserver'>TestServer</a>.

```ts title="Signature"
interface TestServerOptions {
    productsCsvPath?: string;
    initialData: InitialData;
    customerCount?: number;
    logging?: boolean;
}
```

<div className="members-wrapper">

### productsCsvPath

<MemberInfo kind="property" type={`string`}   />

The path to an optional CSV file containing product data to import.
### initialData

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/import-export/initial-data#initialdata'>InitialData</a>`}   />

An object containing non-product data which is used to populate the database.
### customerCount

<MemberInfo kind="property" type={`number`} default="10"   />

The number of fake Customers to populate into the database.
### logging

<MemberInfo kind="property" type={`boolean`} default="false"   />

Set this to `true` to log some information about the database population process.


</div>
