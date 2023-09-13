---
title: "ActionBarItem"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ActionBarItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="96" packageName="@vendure/admin-ui" />

A button in the ActionBar area at the top of one of the list or detail views.

```ts title="Signature"
interface ActionBarItem {
    id: string;
    label: string;
    locationId: ActionBarLocationId;
    disabled?: Observable<boolean>;
    buttonState?: (context: ActionBarContext) => Observable<ActionBarButtonState>;
    onClick?: (event: MouseEvent, context: ActionBarContext) => void;
    routerLink?: RouterLinkDefinition;
    buttonColor?: 'primary' | 'success' | 'warning';
    buttonStyle?: 'solid' | 'outline' | 'link';
    icon?: string;
    requiresPermission?: string | string[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### label

<MemberInfo kind="property" type={`string`}   />


### locationId

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/action-bar/action-bar-location-id#actionbarlocationid'>ActionBarLocationId</a>`}   />


### disabled

<MemberInfo kind="property" type={`Observable&#60;boolean&#62;`}   />

Deprecated since v2.1.0 - use `buttonState` instead.
### buttonState

<MemberInfo kind="property" type={`(context: <a href='/reference/admin-ui-api/action-bar/action-bar-context#actionbarcontext'>ActionBarContext</a>) =&#62; Observable&#60;ActionBarButtonState&#62;`}  since="2.1.0"  />

A function which returns an observable of the button state, allowing you to
dynamically enable/disable or show/hide the button.
### onClick

<MemberInfo kind="property" type={`(event: MouseEvent, context: <a href='/reference/admin-ui-api/action-bar/action-bar-context#actionbarcontext'>ActionBarContext</a>) =&#62; void`}   />


### routerLink

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/action-bar/router-link-definition#routerlinkdefinition'>RouterLinkDefinition</a>`}   />


### buttonColor

<MemberInfo kind="property" type={`'primary' | 'success' | 'warning'`}   />


### buttonStyle

<MemberInfo kind="property" type={`'solid' | 'outline' | 'link'`}   />


### icon

<MemberInfo kind="property" type={`string`}   />


### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />




</div>
