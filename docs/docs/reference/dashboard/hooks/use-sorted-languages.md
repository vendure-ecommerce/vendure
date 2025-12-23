---
title: "UseSortedLanguages"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useSortedLanguages

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-sorted-languages.ts" sourceLine="28" packageName="@vendure/dashboard" />

This hook takes an array of language codes and returns a sorted array of language objects
with code and localized label, sorted alphabetically by the label.

*Example*

```ts
const sortedLanguages = useSortedLanguages(['en', 'fr', 'de']);
// Returns: [{ code: 'de', label: 'German' }, { code: 'en', label: 'English' }, { code: 'fr', label: 'French' }]
```

```ts title="Signature"
function useSortedLanguages(availableLanguages?: string[] | null): SortedLanguage[]
```
Parameters

### availableLanguages

<MemberInfo kind="parameter" type={`string[] | null`} />

