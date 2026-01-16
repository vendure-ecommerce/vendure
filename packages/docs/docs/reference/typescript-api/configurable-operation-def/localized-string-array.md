---
title: "LocalizedStringArray"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## LocalizedStringArray

<GenerationInfo sourceFile="packages/core/src/common/configurable-operation.ts" sourceLine="43" packageName="@vendure/core" />

An array of string values in a given <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>, used to define human-readable string values.
The `ui` property can be used in conjunction with the Vendure Admin UI to specify a custom form input
component.

*Example*

```ts
const title: LocalizedStringArray = [
  { languageCode: LanguageCode.en, value: 'English Title' },
  { languageCode: LanguageCode.de, value: 'German Title' },
  { languageCode: LanguageCode.zh, value: 'Chinese Title' },
]
```

```ts title="Signature"
type LocalizedStringArray = Array<Omit<LocalizedString, '__typename'>>
```
