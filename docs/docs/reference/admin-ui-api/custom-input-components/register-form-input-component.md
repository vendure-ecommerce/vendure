---
title: "RegisterFormInputComponent"
weight: 10
date: 2023-07-14T16:57:51.323Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# registerFormInputComponent
<div class="symbol">


# registerFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/register-dynamic-input-components.ts" sourceLine="96" packageName="@vendure/admin-ui">}}

Registers a custom FormInputComponent which can be used to control the argument inputs
of a <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a> (e.g. CollectionFilter, ShippingMethod etc) or for
a custom field.

*Example*

```TypeScript
@NgModule({
  imports: [SharedModule],
  declarations: [MyCustomFieldControl],
  providers: [
      registerFormInputComponent('my-custom-input', MyCustomFieldControl),
  ],
})
export class MyUiExtensionModule {}
```

This input component can then be used in a custom field:

*Example*

```TypeScript
const config = {
  // ...
  customFields: {
    ProductVariant: [
      {
        name: 'rrp',
        type: 'int',
        ui: { component: 'my-custom-input' },
      },
    ]
  }
}
```

or with an argument of a <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>:

*Example*

```TypeScript
args: {
  rrp: { type: 'int', ui: { component: 'my-custom-input' } },
}
```

## Signature

```TypeScript
function registerFormInputComponent(id: string, component: Type<FormInputComponent>): FactoryProvider
```
## Parameters

### id

{{< member-info kind="parameter" type="string" >}}

### component

{{< member-info kind="parameter" type="Type&#60;<a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>&#62;" >}}

</div>
