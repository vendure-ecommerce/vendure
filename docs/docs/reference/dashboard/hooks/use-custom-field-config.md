---
title: "UseCustomFieldConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useCustomFieldConfig

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-custom-field-config.ts" sourceLine="15" packageName="@vendure/dashboard" since="3.4.0" />

Returns the custom field config for the given entity type (e.g. 'Product').
Also filters out any custom fields that the current active user does not
have permissions to access.

```ts title="Signature"
function useCustomFieldConfig(entityType: string): CustomFieldConfig[]
```
Parameters

### entityType

<MemberInfo kind="parameter" type={`string`} />

