---
title: "FormInputComponent"
weight: 10
date: 2023-07-14T16:57:51.068Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FormInputComponent
<div class="symbol">


# FormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/common/component-registry-types.ts" sourceLine="10" packageName="@vendure/admin-ui">}}

This interface should be implemented by any component being used as a custom input. For example,
inputs for custom fields, or for configurable arguments.

## Signature

```TypeScript
interface FormInputComponent<C = InputComponentConfig> {
  isListInput?: boolean;
  readonly: boolean;
  formControl: FormControl;
  config: C;
}
```
## Members

### isListInput

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}Should be set to `true` if this component is designed to handle lists.
If `true` then the formControl value will be an array of all the
values in the list.{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}This is set by the Admin UI when consuming this component, indicating that the
component should be rendered in a read-only state.{{< /member-description >}}

### formControl

{{< member-info kind="property" type="FormControl"  >}}

{{< member-description >}}This controls the actual value of the form item. The current value is available
as `this.formControl.value`, and an Observable stream of value changes is available
as `this.formControl.valueChanges`. To update the value, use `.setValue(val)` and then
`.markAsDirty()`.

Full documentation can be found in the [Angular docs](https://angular.io/api/forms/FormControl).{{< /member-description >}}

### config

{{< member-info kind="property" type="C"  >}}

{{< member-description >}}The `config` property contains the full configuration object of the custom field or configurable argument.{{< /member-description >}}


</div>
