---
title: "UseDisplayLocale"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useDisplayLocale

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-display-locale.ts" sourceLine="27" packageName="@vendure/dashboard" />

Returns information about the current display language & region.

*Example*

```tsx
const {
  bcp47Tag,
  humanReadableLanguageAndLocale,
  humanReadableLanguage,
  isRTL,
} = useDisplayLocale();

console.log(bcp47Tag) // "en-GB"
console.log(humanReadableLanguage) // "English"
console.log(humanReadableLanguageAndLocale) // "British English"
console.log(isRTL) // false
```

```ts title="Signature"
function useDisplayLocale(): void
```
