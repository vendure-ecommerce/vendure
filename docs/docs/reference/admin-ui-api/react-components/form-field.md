---
title: "FormField"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FormField

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-components/FormField.tsx" sourceLine="22" packageName="@vendure/admin-ui" />

A wrapper around form fields which provides a label, tooltip and error message.

*Example*

```ts
import { FormField } from '@vendure/admin-ui/react';

export function MyReactComponent() {
    return (
       <FormField label="My field" tooltip="This is a tooltip" invalid errorMessage="This field is invalid">
           <input type="text" />
       </FormField>
    );
}
```

```ts title="Signature"
function FormField(props: PropsWithChildren<{
        for?: string;
        label?: string;
        tooltip?: string;
        invalid?: boolean;
        errorMessage?: string;
    }>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`PropsWithChildren&#60;{         for?: string;         label?: string;         tooltip?: string;         invalid?: boolean;         errorMessage?: string;     }&#62;`} />

