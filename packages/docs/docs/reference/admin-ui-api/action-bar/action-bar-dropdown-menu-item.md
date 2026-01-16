---
title: "ActionBarDropdownMenuItem"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ActionBarDropdownMenuItem

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/nav-builder/nav-builder-types.ts" sourceLine="227" packageName="@vendure/admin-ui" since="2.2.0" />

A dropdown menu item in the ActionBar area at the top of one of the list or detail views.

```ts title="Signature"
interface ActionBarDropdownMenuItem {
    id: string;
    label: string;
    locationId: ActionBarLocationId;
    hasDivider?: boolean;
    buttonState?: (context: ActionBarContext) => Observable<ActionBarButtonState | undefined>;
    onClick?: (event: MouseEvent, context: ActionBarContext) => void;
    routerLink?: RouterLinkDefinition;
    icon?: string;
    requiresPermission?: string | string[];
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the item.
### label

<MemberInfo kind="property" type={`string`}   />

The label to display for the item. This can also be a translation token,
e.g. `invoice-plugin.print-invoice`.
### locationId

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/action-bar/action-bar-location-id#actionbarlocationid'>ActionBarLocationId</a>`}   />

The location in the UI where this menu item should be displayed.
### hasDivider

<MemberInfo kind="property" type={`boolean`}   />

Whether to render a divider above this item.
### buttonState

<MemberInfo kind="property" type={`(context: <a href='/reference/admin-ui-api/action-bar/action-bar-context#actionbarcontext'>ActionBarContext</a>) =&#62; Observable&#60;ActionBarButtonState | undefined&#62;`}   />

A function which returns an observable of the button state, allowing you to
dynamically enable/disable or show/hide the button.
### onClick

<MemberInfo kind="property" type={`(event: MouseEvent, context: <a href='/reference/admin-ui-api/action-bar/action-bar-context#actionbarcontext'>ActionBarContext</a>) =&#62; void`}   />


### routerLink

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/action-bar/router-link-definition#routerlinkdefinition'>RouterLinkDefinition</a>`}   />


### icon

<MemberInfo kind="property" type={`string`}   />

An optional icon to display with the item. The icon
should be a valid shape name from the [Clarity Icons](https://core.clarity.design/foundation/icons/shapes/)
set.
### requiresPermission

<MemberInfo kind="property" type={`string | string[]`}   />

Control the display of this item based on the user permissions. Note: if you attempt to pass a
<a href='/reference/typescript-api/auth/permission-definition#permissiondefinition'>PermissionDefinition</a> object, you will get a compilation error. Instead, pass the plain
string version. For example, if the permission is defined as:

```ts
export const MyPermission = new PermissionDefinition('ProductReview');
```
then the generated permission strings will be:

- `CreateProductReview`
- `ReadProductReview`
- `UpdateProductReview`
- `DeleteProductReview`


</div>
