---
title: "FormComponents"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DashboardCustomFormComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/form-components.ts" sourceLine="11" packageName="@vendure/dashboard" since="3.4.0" />

Allows you to define custom form components for custom fields in the dashboard.

```ts title="Signature"
interface DashboardCustomFormComponent {
    id: string;
    component: DashboardFormComponent;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the custom form component. It is a good practice to namespace
these IDs to avoid naming collisions, for example `"my-plugin.markdown-editor"`.
### component

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/form-components#dashboardformcomponent'>DashboardFormComponent</a>`}   />

The React component that will be rendered as the custom form input.


</div>


## DashboardCustomFormComponents

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/extension-api/types/form-components.ts" sourceLine="34" packageName="@vendure/dashboard" since="3.4.0" />

Interface for registering custom field components in the dashboard.
For input and display components, use the co-located approach with detailForms.

```ts title="Signature"
interface DashboardCustomFormComponents {
    customFields?: DashboardCustomFormComponent[];
}
```

<div className="members-wrapper">

### customFields

<MemberInfo kind="property" type={`<a href='/reference/dashboard/extensions-api/form-components#dashboardcustomformcomponent'>DashboardCustomFormComponent</a>[]`}   />

Custom form components for custom fields. These are used when rendering
custom fields in forms.


</div>


## DashboardFormComponentProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/form-engine-types.ts" sourceLine="92" packageName="@vendure/dashboard" since="3.4.0" />

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

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/form-engine-types.ts" sourceLine="124" packageName="@vendure/dashboard" since="3.4.0" />

Metadata which can be defined on a <a href='/reference/dashboard/extensions-api/form-components#dashboardformcomponent'>DashboardFormComponent</a> which
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

TODO: not currently implemented


</div>


## DashboardFormComponent

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/form-engine-types.ts" sourceLine="167" packageName="@vendure/dashboard" since="3.4.0" />

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
