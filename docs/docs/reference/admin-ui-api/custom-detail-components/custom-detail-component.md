---
title: "CustomDetailComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomDetailComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/custom-detail-component/custom-detail-component-types.ts" sourceLine="14" packageName="@vendure/admin-ui" />

CustomDetailComponents allow any arbitrary Angular components to be embedded in entity detail
pages of the Admin UI.

```ts title="Signature"
interface CustomDetailComponent {
    entity$: Observable<any>;
    detailForm: UntypedFormGroup;
}
```

<div className="members-wrapper">

### entity$

<MemberInfo kind="property" type={`Observable&#60;any&#62;`}   />


### detailForm

<MemberInfo kind="property" type={`UntypedFormGroup`}   />




</div>
