---
title: "Navigation Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## NavMenuBadge

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="19" packageName="@vendure/admin-ui" />

A color-coded notification badge which will be displayed by the
NavMenuItem's icon.

```ts title="Signature"
interface NavMenuBadge {
    type: NavMenuBadgeType;
    propagateToSection?: boolean;
}
```

<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`NavMenuBadgeType`}   />


### propagateToSection

<MemberInfo kind="property" type={`boolean`}   />

If true, the badge will propagate to the NavMenuItem's
parent section, displaying a notification badge next
to the section name.


</div>
