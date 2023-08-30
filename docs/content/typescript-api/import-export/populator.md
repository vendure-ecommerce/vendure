---
title: "Populator"
weight: 10
date: 2023-07-14T16:57:49.818Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Populator
<div class="symbol">


# Populator

{{< generation-info sourceFile="packages/core/src/data-import/providers/populator/populator.ts" sourceLine="46" packageName="@vendure/core">}}

Responsible for populating the database with <a href='/typescript-api/import-export/initial-data#initialdata'>InitialData</a>, i.e. non-product data such as countries, tax rates,
shipping methods, payment methods & roles.

## Signature

```TypeScript
class Populator {
  async populateInitialData(data: InitialData, channel?: Channel) => ;
  async populateCollections(data: InitialData, channel?: Channel) => ;
}
```
## Members

### populateInitialData

{{< member-info kind="method" type="(data: <a href='/typescript-api/import-export/initial-data#initialdata'>InitialData</a>, channel?: <a href='/typescript-api/entities/channel#channel'>Channel</a>) => "  >}}

{{< member-description >}}Should be run *before* populating the products, so that there are TaxRates by which
product prices can be set. If the `channel` argument is set, then any <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>entities will be assigned to that Channel.{{< /member-description >}}

### populateCollections

{{< member-info kind="method" type="(data: <a href='/typescript-api/import-export/initial-data#initialdata'>InitialData</a>, channel?: <a href='/typescript-api/entities/channel#channel'>Channel</a>) => "  >}}

{{< member-description >}}Should be run *after* the products have been populated, otherwise the expected FacetValues will not
yet exist.{{< /member-description >}}


</div>
