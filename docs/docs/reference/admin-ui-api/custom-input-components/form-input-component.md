---
title: "FormInputComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/common/component-registry-types.ts" sourceLine="11" packageName="@vendure/admin-ui" />

This interface should be implemented by any component being used as a custom input. For example,
inputs for custom fields, or for configurable arguments.

```ts title="Signature"
interface FormInputComponent<C = InputComponentConfig> {
    isListInput?: boolean;
    readonly: boolean;
    formControl: FormControl;
    config: C;
}
```

<div className="members-wrapper">

### isListInput

<MemberInfo kind="property" type={`boolean`}   />

Should be set to `true` if this component is designed to handle lists.
If `true` then the formControl value will be an array of all the
values in the list.
### readonly

<MemberInfo kind="property" type={`boolean`}   />

This is set by the Admin UI when consuming this component, indicating that the
component should be rendered in a read-only state.
### formControl

<MemberInfo kind="property" type={`FormControl`}   />

This controls the actual value of the form item. The current value is available
as `this.formControl.value`, and an Observable stream of value changes is available
as `this.formControl.valueChanges`. To update the value, use `.setValue(val)` and then
`.markAsDirty()`.

Full documentation can be found in the [Angular docs](https://angular.io/api/forms/FormControl).
### config

<MemberInfo kind="property" type={`C`}   />

The `config` property contains the full configuration object of the custom field or configurable argument.


</div>
