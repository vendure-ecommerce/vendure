---
title: "ConfigurableOperationDefOptions"
weight: 10
date: 2023-07-14T16:57:49.422Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ConfigurableOperationDefOptions
<div class="symbol">


# ConfigurableOperationDefOptions

{{< generation-info sourceFile="packages/core/src/common/configurable-operation.ts" sourceLine="230" packageName="@vendure/core">}}

Common configuration options used when creating a new instance of a
<a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a> (

## Signature

```TypeScript
interface ConfigurableOperationDefOptions<T extends ConfigArgs> extends InjectableStrategy {
  code: string;
  args: T;
  description: LocalizedStringArray;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}A unique code used to identify this operation.{{< /member-description >}}

### args

{{< member-info kind="property" type="T"  >}}

{{< member-description >}}Optional provider-specific arguments which, when specified, are
editable in the admin-ui. For example, args could be used to store an API key
for a payment provider service.

*Example*

```ts
args: {
  apiKey: { type: 'string' },
}
```

See <a href='/typescript-api/configurable-operation-def/config-args#configargs'>ConfigArgs</a> for available configuration options.{{< /member-description >}}

### description

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/localized-string-array#localizedstringarray'>LocalizedStringArray</a>"  >}}

{{< member-description >}}A human-readable description for the operation method.{{< /member-description >}}


</div>
