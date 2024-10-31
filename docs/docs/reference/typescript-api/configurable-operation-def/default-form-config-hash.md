---
title: "DefaultFormConfigHash"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultFormConfigHash

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="160" packageName="@vendure/common" />

Used to define the expected arguments for a given default form input component.

```ts title="Signature"
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

<div className="members-wrapper">

### 'boolean-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'currency-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'customer-group-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'date-form-input'

<MemberInfo kind="property" type={`{ min?: string; max?: string; yearRange?: number }`}   />


### 'facet-value-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'json-editor-form-input'

<MemberInfo kind="property" type={`{ height?: string }`}   />


### 'html-editor-form-input'

<MemberInfo kind="property" type={`{ height?: string }`}   />


### 'number-form-input'

<MemberInfo kind="property" type={`{ min?: number; max?: number; step?: number; prefix?: string; suffix?: string }`}   />


### 'password-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'product-selector-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'relation-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'rich-text-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />


### 'select-form-input'

<MemberInfo kind="property" type={`{         options?: Array&#60;{ value: string; label?: Array&#60;Omit&#60;LocalizedString, '__typename'&#62;&#62; }&#62;;     }`}   />


### 'text-form-input'

<MemberInfo kind="property" type={`{ prefix?: string; suffix?: string }`}   />


### 'textarea-form-input'

<MemberInfo kind="property" type={`{         spellcheck?: boolean;     }`}   />


### 'product-multi-form-input'

<MemberInfo kind="property" type={`{         selectionMode?: 'product' | 'variant';     }`}   />


### 'combination-mode-form-input'

<MemberInfo kind="property" type={`Record&#60;string, never&#62;`}   />




</div>
