---
title: "LocalizedStringArray"
weight: 10
date: 2023-07-14T16:57:49.418Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# LocalizedStringArray
<div class="symbol">


# LocalizedStringArray

{{< generation-info sourceFile="packages/core/src/common/configurable-operation.ts" sourceLine="43" packageName="@vendure/core">}}

An array of string values in a given <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>, used to define human-readable string values.
The `ui` property can be used in conjunction with the Vendure Admin UI to specify a custom form input
component.

*Example*

```TypeScript
const title: LocalizedStringArray = [
  { languageCode: LanguageCode.en, value: 'English Title' },
  { languageCode: LanguageCode.de, value: 'German Title' },
  { languageCode: LanguageCode.zh, value: 'Chinese Title' },
]
```

## Signature

```TypeScript
type LocalizedStringArray = Array<Omit<LocalizedString, '__typename'>>
```
</div>
