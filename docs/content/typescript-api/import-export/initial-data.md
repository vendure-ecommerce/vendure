---
title: "InitialData"
weight: 10
date: 2023-07-14T16:57:49.820Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# InitialData
<div class="symbol">


# InitialData

{{< generation-info sourceFile="packages/core/src/data-import/types.ts" sourceLine="46" packageName="@vendure/core">}}

An object defining initial settings for a new Vendure installation.

## Signature

```TypeScript
interface InitialData {
  defaultLanguage: LanguageCode;
  defaultZone: string;
  roles?: RoleDefinition[];
  countries: CountryDefinition[];
  taxRates: Array<{ name: string; percentage: number }>;
  shippingMethods: Array<{ name: string; price: number }>;
  paymentMethods: Array<{ name: string; handler: ConfigurableOperationInput }>;
  collections: CollectionDefinition[];
}
```
## Members

### defaultLanguage

{{< member-info kind="property" type="<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### defaultZone

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### roles

{{< member-info kind="property" type="RoleDefinition[]"  >}}

{{< member-description >}}{{< /member-description >}}

### countries

{{< member-info kind="property" type="CountryDefinition[]"  >}}

{{< member-description >}}{{< /member-description >}}

### taxRates

{{< member-info kind="property" type="Array&#60;{ name: string; percentage: number }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingMethods

{{< member-info kind="property" type="Array&#60;{ name: string; price: number }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### paymentMethods

{{< member-info kind="property" type="Array&#60;{ name: string; handler: ConfigurableOperationInput }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### collections

{{< member-info kind="property" type="CollectionDefinition[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
