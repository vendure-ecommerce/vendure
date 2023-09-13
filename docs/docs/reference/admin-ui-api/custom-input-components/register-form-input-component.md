---
title: "RegisterFormInputComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-form-input-component.ts" sourceLine="53" packageName="@vendure/admin-ui" />

Registers a custom FormInputComponent which can be used to control the argument inputs
of a <a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a> (e.g. CollectionFilter, ShippingMethod etc.) or for
a custom field.

*Example*

```ts title="providers.ts"
import { registerFormInputComponent } from '@vendure/admin-ui/core';

export default [
    // highlight-next-line
    registerFormInputComponent('my-custom-input', MyCustomFieldControl),
];
```

This input component can then be used in a custom field:

*Example*

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';

const config: VendureConfig = {
  // ...
  customFields: {
    ProductVariant: [
      {
        name: 'rrp',
        type: 'int',
        // highlight-next-line
        ui: { component: 'my-custom-input' },
      },
    ]
  }
}
```

or with an argument of a <a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>:

*Example*

```ts
args: {
  rrp: { type: 'int', ui: { component: 'my-custom-input' } },
}
```

```ts title="Signature"
function registerFormInputComponent(id: string, component: Type<FormInputComponent>): FactoryProvider
```
Parameters

### id

<MemberInfo kind="parameter" type={`string`} />

### component

<MemberInfo kind="parameter" type={`Type&#60;<a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>&#62;`} />

