---
title: "TypedCustomSingleFieldConfig"
weight: 10
date: 2023-07-14T16:57:49.517Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TypedCustomSingleFieldConfig
<div class="symbol">


# TypedCustomSingleFieldConfig

{{< generation-info sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="55" packageName="@vendure/core">}}

Configures a custom field on an entity in the <a href='/typescript-api/custom-fields/#customfields'>CustomFields</a> config object.

## Signature

```TypeScript
type TypedCustomSingleFieldConfig<T extends CustomFieldType, C extends CustomField> = BaseTypedCustomFieldConfig<T, C> & {
    list?: false;
    defaultValue?: DefaultValueType<T>;
    validate?: (
        value: DefaultValueType<T>,
        injector: Injector,
    ) => string | LocalizedString[] | void | Promise<string | LocalizedString[] | void>;
}
```
</div>
