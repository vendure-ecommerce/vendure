---
title: "UseLocalFormat"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useLocalFormat

<GenerationInfo sourceFile="packages/dashboard/src/lib/hooks/use-local-format.ts" sourceLine="26" packageName="@vendure/dashboard" />

This hook is used to format numbers and currencies using the configured language and
locale of the dashboard app.

*Example*

```ts
const {
         formatCurrency,
         formatNumber,
         formatDate,
         formatLanguageName,
         formatCurrencyName,
         toMajorUnits,
} = useLocalFormat();
```

```ts title="Signature"
function useLocalFormat(): void
```
