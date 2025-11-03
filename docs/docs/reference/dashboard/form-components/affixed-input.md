---
title: "AffixedInput"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AffixedInput

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/data-input/affixed-input.tsx" sourceLine="31" packageName="@vendure/dashboard" />

A component for displaying an input with a prefix and/or a suffix.

*Example*

```tsx
<AffixedInput
    {...field}
    type="number"
    suffix="%"
    value={field.value}
    onChange={e => field.onChange(e.target.valueAsNumber)}
/>
```

```ts title="Signature"
function AffixedInput(props: Readonly<AffixedInputProps>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`Readonly&#60;AffixedInputProps&#62;`} />

