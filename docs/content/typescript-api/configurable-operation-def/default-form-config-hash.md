---
title: "DefaultFormConfigHash"
weight: 10
date: 2023-07-14T16:57:50.658Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultFormConfigHash
<div class="symbol">


# DefaultFormConfigHash

{{< generation-info sourceFile="packages/common/src/shared-types.ts" sourceLine="159" packageName="@vendure/common">}}

Used to define the expected arguments for a given default form input component.

## Signature

```TypeScript
type DefaultFormConfigHash = {
  'boolean-form-input': Record<string, never>;
  'currency-form-input': Record<string, never>;
  'customer-group-form-input': Record<string, never>;
  'date-form-input': { min?: string; max?: string; yearRange?: number };
  'facet-value-form-input': Record<string, never>;
  'json-editor-form-input': { height?: string };
  'html-editor-form-input': { height?: string };
  'number-form-input': { min?: number; max?: number; step?: number; prefix?: string; suffix?: string };
  'password-form-input': Record<string, never>;
  'product-selector-form-input': Record<string, never>;
  'relation-form-input': Record<string, never>;
  'rich-text-form-input': Record<string, never>;
  'select-form-input': {
        options?: Array<{ value: string; label?: Array<Omit<LocalizedString, '__typename'>> }>;
    };
  'text-form-input': { prefix?: string; suffix?: string };
  'textarea-form-input': {
        spellcheck?: boolean;
    };
  'product-multi-form-input': {
        selectionMode?: 'product' | 'variant';
    };
  'combination-mode-form-input': Record<string, never>;
}
```
## Members

### 'boolean-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'currency-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'customer-group-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'date-form-input'

{{< member-info kind="property" type="{ min?: string; max?: string; yearRange?: number }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'facet-value-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'json-editor-form-input'

{{< member-info kind="property" type="{ height?: string }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'html-editor-form-input'

{{< member-info kind="property" type="{ height?: string }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'number-form-input'

{{< member-info kind="property" type="{ min?: number; max?: number; step?: number; prefix?: string; suffix?: string }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'password-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'product-selector-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'relation-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'rich-text-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### 'select-form-input'

{{< member-info kind="property" type="{         options?: Array&#60;{ value: string; label?: Array&#60;Omit&#60;LocalizedString, '__typename'&#62;&#62; }&#62;;     }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'text-form-input'

{{< member-info kind="property" type="{ prefix?: string; suffix?: string }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'textarea-form-input'

{{< member-info kind="property" type="{         spellcheck?: boolean;     }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'product-multi-form-input'

{{< member-info kind="property" type="{         selectionMode?: 'product' | 'variant';     }"  >}}

{{< member-description >}}{{< /member-description >}}

### 'combination-mode-form-input'

{{< member-info kind="property" type="Record&#60;string, never&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
