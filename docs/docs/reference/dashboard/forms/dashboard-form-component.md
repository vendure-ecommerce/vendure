---
title: "DashboardFormComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardFormComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/form-engine-types.ts" sourceLine="161" packageName="@vendure/dashboard" />

This is the common type for all custom form components registered for:

- custom fields
- configurable operation args
- detail page fields

Here's a simple example:

```ts
import { DashboardFormComponent, Input } from '@vendure/dashboard';

const MyComponent: DashboardFormComponent = (props) => {
    return <Input value={props.value}
                  onChange={props.onChange}
                  onBlur={props.onBlur}
                  name={props.name}
                  disabled={props.disabled}
                  ref={props.ref}
                  />;
};
```

```ts title="Signature"
type DashboardFormComponent = React.ComponentType<DashboardFormComponentProps> & {
    metadata?: DashboardFormComponentMetadata;
}
```


## DashboardFormComponentProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/form-engine-types.ts" sourceLine="91" packageName="@vendure/dashboard" />

Props that get passed to all form input components. They are based on the
controller props used by the underlying `react-hook-form`, i.e.:

```ts
export type ControllerRenderProps = {
    onChange: (event: any) => void;
    onBlur: () => void;
    value: any;
    disabled?: boolean;
    name: string;
    ref: RefCallBack;
};
```

in addition, they can optionally be passed a `fieldDef` prop if the
component is used in the context of a custom field or configurable operation arg.

The `fieldDef` arg, when present, has the following shape:

```ts
export type ConfigurableArgDef = {
    defaultValue: any
    description: string | null
    label: string | null
    list: boolean
    name: string
    required: boolean
    type: string
    ui: any
}
```

```ts title="Signature"
type DashboardFormComponentProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = ControllerRenderProps<TFieldValues, TName> & {
    fieldDef?: ConfigurableFieldDef;
}
```


## DashboardFormComponentMetadata

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/form-engine-types.ts" sourceLine="122" packageName="@vendure/dashboard" />

Metadata which can be defined on a <a href='/reference/dashboard/forms/dashboard-form-component#dashboardformcomponent'>DashboardFormComponent</a> which
provides additional information about how the dashboard should render the
component.

The metadata is defined by adding the static property on the component:

*Example*

```ts
export const MyCustomInput: DashboardFormComponent = props => {
  // implementation omitted
}

// highlight-start
MyCustomInput.metadata = {
  isListInput: true
}
// highlight-end
```

```ts title="Signature"
type DashboardFormComponentMetadata = {
    isListInput?: boolean | 'dynamic';
    isFullWidth?: boolean;
}
```

<div className="members-wrapper">

### isListInput

<MemberInfo kind="property" type={`boolean | 'dynamic'`}   />

Defines whether this form component is designed to handle list inputs.
If set to `'dynamic'`, it means the component has internal logic that can
handle both lists and single values.
### isFullWidth

<MemberInfo kind="property" type={`boolean`}   />




</div>
