---
title: "ActionBarItem"
weight: 10
date: 2023-07-21T07:17:04.141Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ActionBarItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="89" packageName="@vendure/admin-ui" />

A button in the ActionBar area at the top of one of the list or detail views.

```ts title="Signature"
interface ActionBarItem {
  id: string;
  label: string;
  locationId: ActionBarLocationId;
  disabled?: Observable<boolean>;
  onClick?: (event: MouseEvent, context: OnClickContext) => void;
  routerLink?: RouterLinkDefinition;
  buttonColor?: 'primary' | 'success' | 'warning';
  buttonStyle?: 'solid' | 'outline' | 'link';
  icon?: string;
  requiresPermission?: string | string[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type="string"   />


### label

<MemberInfo kind="property" type="string"   />


### locationId

<MemberInfo kind="property" type="<a href='/docs/reference/admin-ui-api/action-bar/action-bar-location-id#actionbarlocationid'>ActionBarLocationId</a>"   />


### disabled

<MemberInfo kind="property" type="Observable&#60;boolean&#62;"   />


### onClick

<MemberInfo kind="property" type="(event: MouseEvent, context: <a href='/docs/reference/admin-ui-api/action-bar/on-click-context#onclickcontext'>OnClickContext</a>) =&#62; void"   />


### routerLink

<MemberInfo kind="property" type="RouterLinkDefinition"   />


### buttonColor

<MemberInfo kind="property" type="'primary' | 'success' | 'warning'"   />


### buttonStyle

<MemberInfo kind="property" type="'solid' | 'outline' | 'link'"   />


### icon

<MemberInfo kind="property" type="string"   />


### requiresPermission

<MemberInfo kind="property" type="string | string[]"   />




</div>
