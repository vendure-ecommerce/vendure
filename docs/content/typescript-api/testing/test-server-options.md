---
title: "TestServerOptions"
weight: 10
date: 2023-07-14T16:57:50.827Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TestServerOptions
<div class="symbol">


# TestServerOptions

{{< generation-info sourceFile="packages/testing/src/types.ts" sourceLine="14" packageName="@vendure/testing">}}

Configuration options used to initialize an instance of the <a href='/typescript-api/testing/test-server#testserver'>TestServer</a>.

## Signature

```TypeScript
interface TestServerOptions {
  productsCsvPath?: string;
  initialData: InitialData;
  customerCount?: number;
  logging?: boolean;
}
```
## Members

### productsCsvPath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The path to an optional CSV file containing product data to import.{{< /member-description >}}

### initialData

{{< member-info kind="property" type="<a href='/typescript-api/import-export/initial-data#initialdata'>InitialData</a>"  >}}

{{< member-description >}}An object containing non-product data which is used to populate the database.{{< /member-description >}}

### customerCount

{{< member-info kind="property" type="number" default="10"  >}}

{{< member-description >}}The number of fake Customers to populate into the database.{{< /member-description >}}

### logging

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}Set this to `true` to log some information about the database population process.{{< /member-description >}}


</div>
