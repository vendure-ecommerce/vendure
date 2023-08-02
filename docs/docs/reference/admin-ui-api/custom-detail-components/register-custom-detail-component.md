---
title: "RegisterCustomDetailComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerCustomDetailComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-detail-component/custom-detail-component.service.ts" sourceLine="12" packageName="@vendure/admin-ui" />

Registers a <a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component#customdetailcomponent'>CustomDetailComponent</a> to be placed in a given location. This allows you
to embed any type of custom Angular component in the entity detail pages of the Admin UI.

```ts title="Signature"
function registerCustomDetailComponent(config: CustomDetailComponentConfig): Provider
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component-config#customdetailcomponentconfig'>CustomDetailComponentConfig</a>`} />

