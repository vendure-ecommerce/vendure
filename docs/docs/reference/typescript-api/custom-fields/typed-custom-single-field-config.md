---
title: "TypedCustomSingleFieldConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TypedCustomSingleFieldConfig

<GenerationInfo sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="66" packageName="@vendure/core" />

Configures a custom field on an entity in the <a href='/reference/typescript-api/custom-fields/#customfields'>CustomFields</a> config object.

```ts title="Signature"
type TypedCustomSingleFieldConfig<T extends CustomFieldType, C extends CustomField> = BaseTypedCustomFieldConfig<T, C> & {
    list?: false;
    defaultValue?: DefaultValueType<T>;
    validate?: (
        value: DefaultValueType<T>,
        injector: Injector,
        ctx: RequestContext,
    ) => string | LocalizedString[] | void | Promise<string | LocalizedString[] | void>;
}
```
