---
title: "ReactCustomDetailComponentConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ReactCustomDetailComponentConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/register-react-custom-detail-component.ts" sourceLine="15" packageName="@vendure/admin-ui" />

Configures a React-based component to be placed in a detail page in the given location.

```ts title="Signature"
interface ReactCustomDetailComponentConfig {
    locationId: CustomDetailComponentLocationId;
    component: ElementType;
    props?: Record<string, any>;
}
```

<div className="members-wrapper">

### locationId

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/custom-detail-components/custom-detail-component-location-id#customdetailcomponentlocationid'>CustomDetailComponentLocationId</a>`}   />

The id of the detail page location in which to place the component.
### component

<MemberInfo kind="property" type={`ElementType`}   />

The React component to render.
### props

<MemberInfo kind="property" type={`Record&#60;string, any&#62;`}   />

Optional props to pass to the React component.


</div>
