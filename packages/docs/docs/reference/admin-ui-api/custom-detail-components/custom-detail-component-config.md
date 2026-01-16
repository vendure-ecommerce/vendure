---
title: "CustomDetailComponentConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomDetailComponentConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-detail-component/custom-detail-component-types.ts" sourceLine="25" packageName="@vendure/admin-ui" />

Configures a <a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component#customdetailcomponent'>CustomDetailComponent</a> to be placed in the given location.

```ts title="Signature"
interface CustomDetailComponentConfig {
    locationId: CustomDetailComponentLocationId;
    component: Type<CustomDetailComponent>;
    providers?: Provider[];
}
```

<div className="members-wrapper">

### locationId

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component-location-id#customdetailcomponentlocationid'>CustomDetailComponentLocationId</a>`}   />


### component

<MemberInfo kind="property" type={`Type&#60;<a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component#customdetailcomponent'>CustomDetailComponent</a>&#62;`}   />


### providers

<MemberInfo kind="property" type={`Provider[]`}   />




</div>
