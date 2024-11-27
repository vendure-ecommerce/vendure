---
title: "CustomFields"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomFields

<GenerationInfo sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="264" packageName="@vendure/core" />

Most entities can have additional fields added to them by defining an array of <a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>
objects on against the corresponding key.

*Example*

```ts
bootstrap({
    // ...
    customFields: {
        Product: [
            { name: 'infoUrl', type: 'string' },
            { name: 'downloadable', type: 'boolean', defaultValue: false },
            { name: 'shortName', type: 'localeString' },
        ],
        User: [
            { name: 'socialLoginToken', type: 'string', public: false },
        ],
    },
})
```

```ts title="Signature"
type CustomFields = {
    Address?: CustomFieldConfig[];
    Administrator?: CustomFieldConfig[];
    Asset?: CustomFieldConfig[];
    Channel?: CustomFieldConfig[];
    Collection?: CustomFieldConfig[];
    Customer?: CustomFieldConfig[];
    CustomerGroup?: CustomFieldConfig[];
    Facet?: CustomFieldConfig[];
    FacetValue?: CustomFieldConfig[];
    Fulfillment?: CustomFieldConfig[];
    GlobalSettings?: CustomFieldConfig[];
    HistoryEntry?: CustomFieldConfig[];
    Order?: CustomFieldConfig[];
    OrderLine?: CustomFieldConfig[];
    Payment?: CustomFieldConfig[];
    PaymentMethod?: CustomFieldConfig[];
    Product?: CustomFieldConfig[];
    ProductOption?: CustomFieldConfig[];
    ProductOptionGroup?: CustomFieldConfig[];
    ProductVariant?: CustomFieldConfig[];
    ProductVariantPrice?: CustomFieldConfig[];
    Promotion?: CustomFieldConfig[];
    Refund?: CustomFieldConfig[];
    Region?: CustomFieldConfig[];
    Seller?: CustomFieldConfig[];
    Session?: CustomFieldConfig[];
    ShippingLine?: CustomFieldConfig[];
    ShippingMethod?: CustomFieldConfig[];
    StockLevel?: CustomFieldConfig[];
    StockLocation?: CustomFieldConfig[];
    StockMovement?: CustomFieldConfig[];
    TaxCategory?: CustomFieldConfig[];
    TaxRate?: CustomFieldConfig[];
    User?: CustomFieldConfig[];
    Zone?: CustomFieldConfig[];
} & { [entity: string]: CustomFieldConfig[] }
```
