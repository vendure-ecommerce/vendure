---
title: "FacetValueSelector"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FacetValueSelector

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/facet-value-selector.tsx" sourceLine="143" packageName="@vendure/dashboard" since="3.4.0" />

A component for selecting facet values.

*Example*

```tsx
<FacetValueSelector onValueSelect={onValueSelectHandler} disabled={disabled} />
```

```ts title="Signature"
function FacetValueSelector(props: FacetValueSelectorProps): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/components/facet-value-selector#facetvalueselectorprops'>FacetValueSelectorProps</a>`} />



## FacetValueSelectorProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/facet-value-selector.tsx" sourceLine="40" packageName="@vendure/dashboard" since="3.4.0" />

A component for selecting facet values.

```ts title="Signature"
interface FacetValueSelectorProps {
    onValueSelect: (value: FacetValue) => void;
    disabled?: boolean;
    placeholder?: string;
    pageSize?: number;
}
```

<div className="members-wrapper">

### onValueSelect

<MemberInfo kind="property" type={`(value: <a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>) =&#62; void`}   />

The function to call when a facet value is selected.

The `value` will have the following structure:

```ts
{
    id: string;
    name: string;
    code: string;
    facet: {
        id: string;
        name: string;
        code: string;
    };
}
```
### disabled

<MemberInfo kind="property" type={`boolean`}   />

Whether the selector is disabled.
### placeholder

<MemberInfo kind="property" type={`string`}   />

The placeholder text for the selector.
### pageSize

<MemberInfo kind="property" type={`number`} default={`4`}   />

The number of facet values to display per page.


</div>
