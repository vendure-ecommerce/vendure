---
title: "SlugInput"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SlugInput

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/data-input/slug-input.tsx" sourceLine="137" packageName="@vendure/dashboard" />

A component for generating and displaying slugs based on a watched field.
The component watches a source field for changes, debounces the input,
and generates a unique slug via the Admin API. The slug is only auto-generated
when it's empty. For existing slugs, a regenerate button allows manual regeneration.
The input is readonly by default but can be made editable with a toggle button.

*Example*

```tsx
// In a TranslatableFormFieldWrapper context with translatable field
<SlugInput
    {...field}
    entityName="Product"
    fieldName="slug"
    watchFieldName="name" // Automatically resolves to "translations.X.name"
    entityId={productId}
/>

// In a TranslatableFormFieldWrapper context with non-translatable field
<SlugInput
    {...field}
    entityName="Product"
    fieldName="slug"
    watchFieldName="enabled" // Uses "enabled" directly (base entity field)
    entityId={productId}
/>

// For non-translatable entities
<SlugInput
    {...field}
    entityName="Channel"
    fieldName="code"
    watchFieldName="name" // Uses "name" directly
    entityId={channelId}
/>
```

```ts title="Signature"
function SlugInput(props: SlugInputProps): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`SlugInputProps`} />

