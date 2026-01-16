---
title: "RegisterReactCustomDetailComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## registerReactCustomDetailComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/register-react-custom-detail-component.ts" sourceLine="40" packageName="@vendure/admin-ui" />

Registers a React component to be rendered in a detail page in the given location.
Components used as custom detail components can make use of the <a href='/reference/admin-ui-api/react-hooks/use-detail-component-data#usedetailcomponentdata'>useDetailComponentData</a> hook.

```ts title="Signature"
function registerReactCustomDetailComponent(config: ReactCustomDetailComponentConfig): void
```
Parameters

### config

<MemberInfo kind="parameter" type={`<a href='/reference/admin-ui-api/react-extensions/react-custom-detail-component-config#reactcustomdetailcomponentconfig'>ReactCustomDetailComponentConfig</a>`} />

