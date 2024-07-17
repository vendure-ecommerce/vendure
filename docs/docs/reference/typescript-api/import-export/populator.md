---
title: "Populator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Populator

<GenerationInfo sourceFile="packages/core/src/data-import/providers/populator/populator.ts" sourceLine="46" packageName="@vendure/core" />

Responsible for populating the database with <a href='/reference/typescript-api/import-export/initial-data#initialdata'>InitialData</a>, i.e. non-product data such as countries, tax rates,
shipping methods, payment methods & roles.

```ts title="Signature"
class Populator {
    populateInitialData(data: InitialData, channel?: Channel) => ;
    populateCollections(data: InitialData, channel?: Channel) => ;
}
```

<div className="members-wrapper">

### populateInitialData

<MemberInfo kind="method" type={`(data: <a href='/reference/typescript-api/import-export/initial-data#initialdata'>InitialData</a>, channel?: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>) => `}   />

Should be run *before* populating the products, so that there are TaxRates by which
product prices can be set. If the `channel` argument is set, then any <a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
entities will be assigned to that Channel.
### populateCollections

<MemberInfo kind="method" type={`(data: <a href='/reference/typescript-api/import-export/initial-data#initialdata'>InitialData</a>, channel?: <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>) => `}   />

Should be run *after* the products have been populated, otherwise the expected FacetValues will not
yet exist.


</div>
