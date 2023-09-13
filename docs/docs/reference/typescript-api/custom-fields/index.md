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

<GenerationInfo sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="147" packageName="@vendure/core" />

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
interface CustomFields {
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
    Order?: CustomFieldConfig[];
    OrderLine?: CustomFieldConfig[];
    PaymentMethod?: CustomFieldConfig[];
    Product?: CustomFieldConfig[];
    ProductOption?: CustomFieldConfig[];
    ProductOptionGroup?: CustomFieldConfig[];
    ProductVariant?: CustomFieldConfig[];
    Promotion?: CustomFieldConfig[];
    Region?: CustomFieldConfig[];
    Seller?: CustomFieldConfig[];
    ShippingMethod?: CustomFieldConfig[];
    StockLocation?: CustomFieldConfig[];
    TaxCategory?: CustomFieldConfig[];
    TaxRate?: CustomFieldConfig[];
    User?: CustomFieldConfig[];
    Zone?: CustomFieldConfig[];
}
```

<div className="members-wrapper">

### Address

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Administrator

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Asset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Channel

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Collection

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Customer

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### CustomerGroup

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Facet

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### FacetValue

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Fulfillment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### GlobalSettings

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### OrderLine

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### PaymentMethod

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Product

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### ProductOption

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### ProductOptionGroup

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### ProductVariant

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Promotion

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Region

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Seller

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### ShippingMethod

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### StockLocation

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### TaxCategory

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### TaxRate

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### User

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />


### Zone

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]`}   />




</div>
