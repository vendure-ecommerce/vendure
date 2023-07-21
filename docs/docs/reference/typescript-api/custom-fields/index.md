---
title: "CustomFields"
weight: 10
date: 2023-07-21T15:46:15.023Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomFields

<GenerationInfo sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="205" packageName="@vendure/core" />

Most entities can have additional fields added to them by defining an array of <a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>
objects on against the corresponding key.

### Configuration options

All custom fields share some common properties:

* `name: string`: The name of the field.
* `type: string`: A string of type <a href='/reference/typescript-api/custom-fields/custom-field-type#customfieldtype'>CustomFieldType</a>.
* `list: boolean`: If set to `true`, then the field will be an array of the specified type.
* `label?: LocalizedString[]`: An array of localized labels for the field.
* `description?: LocalizedString[]`: An array of localized descriptions for the field.
* `public?: boolean`: Whether or not the custom field is available via the Shop API. Defaults to `true`.
* `readonly?: boolean`: Whether or not the custom field can be updated via the GraphQL APIs. Defaults to `false`.
* `internal?: boolean`: Whether or not the custom field is exposed at all via the GraphQL APIs. Defaults to `false`.
* `defaultValue?: any`: The default value when an Entity is created with this field.
* `nullable?: boolean`: Whether the field is nullable in the database. If set to `false`, then a `defaultValue` should be provided.
* `unique?: boolean`: Whether the value of the field should be unique. When set to `true`, a UNIQUE constraint is added to the column. Defaults
    to `false`.
* `validate?: (value: any) => string | LocalizedString[] | void`: A custom validation function. If the value is valid, then
    the function should not return a value. If a string or LocalizedString array is returned, this is interpreted as an error message.

The `LocalizedString` type looks like this:

```ts
type LocalizedString = {
  languageCode: LanguageCode;
  value: string;
};
```

In addition to the common properties, the following field types have some type-specific properties:

#### `string` type

* `pattern?: string`: A regex pattern which the field value must match
* `options?: { value: string; label?: LocalizedString[]; };`: An array of pre-defined options for the field.
* `length?: number`: The max length of the varchar created in the database. Defaults to 255. Maximum is 65,535.

#### `localeString` type

* `pattern?: string`: A regex pattern which the field value must match
* `length?: number`: The max length of the varchar created in the database. Defaults to 255. Maximum is 65,535.

#### `int` & `float` type

* `min?: number`: The minimum permitted value
* `max?: number`: The maximum permitted value
* `step?: number`: The step value

#### `datetime` type

The min, max & step properties for datetime fields are intended to be used as described in
[the datetime-local docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes)

* `min?: string`: The earliest permitted date
* `max?: string`: The latest permitted date
* `step?: string`: The step value

#### `relation` type

* `entity: VendureEntity`: The entity which this custom field is referencing
* `eager?: boolean`: Whether to [eagerly load](https://typeorm.io/#/eager-and-lazy-relations) the relation. Defaults to false.
* `graphQLType?: string`: The name of the GraphQL type that corresponds to the entity.
    Can be omitted if it is the same, which is usually the case.

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

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Administrator

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Asset

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Channel

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Collection

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Customer

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### CustomerGroup

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Facet

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### FacetValue

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Fulfillment

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### GlobalSettings

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Order

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### OrderLine

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### PaymentMethod

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Product

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### ProductOption

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### ProductOptionGroup

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### ProductVariant

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Promotion

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Region

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Seller

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### ShippingMethod

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### StockLocation

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### TaxCategory

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### TaxRate

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### User

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />


### Zone

<MemberInfo kind="property" type="<a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]"   />




</div>
