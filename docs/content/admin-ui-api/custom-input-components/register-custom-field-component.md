---
title: "RegisterCustomFieldComponent"
weight: 10
date: 2023-06-06T14:49:35.964Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# registerCustomFieldComponent
<div class="symbol">


# registerCustomFieldComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/register-dynamic-input-components.ts" sourceLine="130" packageName="@vendure/admin-ui">}}

**Deprecated** use `registerFormInputComponent()` in combination with the customField `ui` config instead.

Registers a custom component to act as the form input control for the given custom field.
This should be used in the NgModule `providers` array of your ui extension module.

*Example*

```TypeScript
@NgModule({
  imports: [SharedModule],
  declarations: [MyCustomFieldControl],
  providers: [
      registerCustomFieldComponent('Product', 'someCustomField', MyCustomFieldControl),
  ],
})
export class MyUiExtensionModule {}
```

## Signature

```TypeScript
function registerCustomFieldComponent(entity: CustomFieldEntityName, fieldName: string, component: Type<CustomFieldControl>): FactoryProvider
```
## Parameters

### entity

{{< member-info kind="parameter" type="CustomFieldEntityName" >}}

### fieldName

{{< member-info kind="parameter" type="string" >}}

### component

{{< member-info kind="parameter" type="Type&#60;CustomFieldControl&#62;" >}}

</div>
