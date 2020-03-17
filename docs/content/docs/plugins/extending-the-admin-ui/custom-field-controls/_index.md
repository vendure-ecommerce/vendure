---
title: 'CustomField Controls'
weight: 5
---

# CustomField Controls

Another way to extend the Admin UI app is to define custom form control components for manipulating any [Custom Fields]({{< ref "/docs/typescript-api/custom-fields" >}}) you have defined on your entities.

Let's say you define a custom "intensity" field on the Product entity:

```TypeScript
// project/vendure-config.ts

customFields: {
  Product: [
    { name: 'intensity', type: 'int', min: 0, max: 100, defaultValue: 0 },
  ],
}
```

By default, the "intensity" field will be displayed as a number input:

{{< figure src="./ui-extensions-custom-field-default.jpg" >}}

But let's say we want to display a range slider instead. Here's how we can do this using our shared extension module combined with the `registerCustomFieldComponent()` function:

```TypeScript
import { NgModule, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedModule, CustomFieldControl, 
  CustomFieldConfigType, registerCustomFieldComponent } from '@vendure/admin-ui/core';

@Component({
  template: `
    <input
        type="range"
        [min]="customFieldConfig.intMin"
        [max]="customFieldConfig.intMax"
        [formControl]="formControl" />
    {{ formControl.value }}
  `,
})
export class SliderControl implements CustomFieldControl {
  customFieldConfig: CustomFieldConfigType;
  formControl: FormControl;
}

@NgModule({
  imports: [SharedModule],
  declarations: [SliderControl],
  providers: [
    registerCustomFieldComponent('Product', 'intensity', SliderControl),
  ]
})
export class SharedExtensionModule { }
```

Re-compiling the Admin UI will result in our SliderControl now being used for the "intensity" custom field:

{{< figure src="./ui-extensions-custom-field-slider.jpg" >}}

To recap the steps involved:

1. Create an Angular Component which implements the `CustomFieldControl` interface.
2. Add this component to your shared extension module's `declarations` array.
3. Use `registerCustomFieldComponent()` to register your component for the given entity & custom field name.

