---
title: "RegisterAlert"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerAlert

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/extension/register-alert.ts" sourceLine="12" packageName="@vendure/admin-ui" since="2.2.0" />

Registers an alert which can be displayed in the Admin UI alert dropdown in the top bar.
The alert is configured using the <a href='/reference/admin-ui-api/alerts/alert-config#alertconfig'>AlertConfig</a> object.

```ts title="Signature"
function registerAlert(config: AlertConfig): FactoryProvider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/alerts/alert-config#alertconfig'>AlertConfig</a>`} />

