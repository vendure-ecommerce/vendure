---
title: "ConfigArgs"
weight: 10
date: 2023-07-14T16:57:49.421Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ConfigArgs
<div class="symbol">


# ConfigArgs

{{< generation-info sourceFile="packages/core/src/common/configurable-operation.ts" sourceLine="140" packageName="@vendure/core">}}

A object which defines the configurable arguments which may be passed to
functions in those classes which implement the <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a> interface.

## Data types
Each argument has a data type, which must be one of <a href='/typescript-api/configurable-operation-def/config-arg-type#configargtype'>ConfigArgType</a>.

*Example*

```TypeScript
{
  apiKey: { type: 'string' },
  maxRetries: { type: 'int' },
  logErrors: { type: 'boolean' },
}
```

## Lists
Setting the `list` property to `true` will make the argument into an array of the specified
data type. For example, if you want to store an array of strings:

*Example*

```TypeScript
{
  aliases: {
    type: 'string',
    list: true,
  },
}
```
In the Admin UI, this will be rendered as an orderable list of string inputs.

## UI Component
The `ui` field allows you to specify a specific input component to be used in the Admin UI.
When not set, a default input component is used appropriate to the data type.

*Example*

```TypeScript
{
  operator: {
    type: 'string',
    ui: {
      component: 'select-form-input',
      options: [
        { value: 'startsWith' },
        { value: 'endsWith' },
        { value: 'contains' },
        { value: 'doesNotContain' },
      ],
    },
  },
  secretKey: {
    type: 'string',
    ui: { component: 'password-form-input' },
  },
}
```
The available components as well as their configuration options can be found in the <a href='/typescript-api/configurable-operation-def/default-form-config-hash#defaultformconfighash'>DefaultFormConfigHash</a> docs.
Custom UI components may also be defined via an Admin UI extension using the `registerFormInputComponent()` function
which is exported from `@vendure/admin-ui/core`.

## Signature

```TypeScript
type ConfigArgs = {
  [name: string]: ConfigArgDef<ConfigArgType>;
}
```
## Members

### [index]

{{< member-info kind="property" type="ConfigArgDef&#60;<a href='/typescript-api/configurable-operation-def/config-arg-type#configargtype'>ConfigArgType</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
