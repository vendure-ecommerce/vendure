---
title: "UseFormControl"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useFormControl

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-form-control.ts" sourceLine="31" packageName="@vendure/admin-ui" />

Provides access to the current FormControl value and a method to update the value.

*Example*

```ts
import { useFormControl, ReactFormInputProps } from '@vendure/admin-ui/react';
import React from 'react';

export function ReactNumberInput({ readonly }: ReactFormInputProps) {
    const { value, setFormValue } = useFormControl();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(val);
    };
    return (
        <div>
            <input readOnly={readonly} type="number" onChange={handleChange} value={value} />
        </div>
    );
}
```

```ts title="Signature"
function useFormControl(): void
```
