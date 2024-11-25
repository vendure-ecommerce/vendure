---
title: "BulkAction"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BulkAction

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="99" packageName="@vendure/admin-ui" since="1.8.0" />

Configures a bulk action which can be performed on all selected items in a list view.

For a full example, see the <a href='/reference/admin-ui-api/bulk-actions/register-bulk-action#registerbulkaction'>registerBulkAction</a> docs.

```ts title="Signature"
interface BulkAction<ItemType = any, ComponentType = any> {
    location: BulkActionLocationId;
    label: string;
    getTranslationVars?: (
        context: BulkActionFunctionContext<ItemType, ComponentType>,
    ) => Record<string, string | number> | Promise<Record<string, string | number>>;
    icon?: string;
    iconClass?: string;
    onClick: (context: BulkActionClickContext<ItemType, ComponentType>) => void;
    isVisible?: (context: BulkActionFunctionContext<ItemType, ComponentType>) => boolean | Promise<boolean>;
    requiresPermission?: string | ((userPermissions: string[]) => boolean);
}
```

<div className="members-wrapper">

### location

<MemberInfo kind="property" type={`<a href='/reference/admin-ui-api/bulk-actions/bulk-action#bulkactionlocationid'>BulkActionLocationId</a>`}   />


### label

<MemberInfo kind="property" type={`string`}   />


### getTranslationVars

<MemberInfo kind="property" type={`(         context: <a href='/reference/admin-ui-api/bulk-actions/bulk-action#bulkactionfunctioncontext'>BulkActionFunctionContext</a>&#60;ItemType, ComponentType&#62;,     ) =&#62; Record&#60;string, string | number&#62; | Promise&#60;Record&#60;string, string | number&#62;&#62;`}   />

An optional function that should resolve to a map of translation variables which can be
used when translating the `label` string.
### icon

<MemberInfo kind="property" type={`string`}   />

A valid [Clarity Icons](https://core.clarity.design/foundation/icons/shapes/) icon shape, e.g.
"cog", "user", "info-standard".
### iconClass

<MemberInfo kind="property" type={`string`}   />

A class to be added to the icon element. Examples:

- is-success
- is-danger
- is-warning
- is-info
- is-highlight
### onClick

<MemberInfo kind="property" type={`(context: <a href='/reference/admin-ui-api/bulk-actions/bulk-action#bulkactionclickcontext'>BulkActionClickContext</a>&#60;ItemType, ComponentType&#62;) =&#62; void`}   />

Defines the logic that executes when the bulk action button is clicked.
### isVisible

<MemberInfo kind="property" type={`(context: <a href='/reference/admin-ui-api/bulk-actions/bulk-action#bulkactionfunctioncontext'>BulkActionFunctionContext</a>&#60;ItemType, ComponentType&#62;) =&#62; boolean | Promise&#60;boolean&#62;`}   />

A function that determines whether this bulk action item should be displayed in the menu.
If not defined, the item will always be displayed.

This function will be invoked each time the selection is changed, so try to avoid expensive code
running here.

*Example*

```ts
import { registerBulkAction, DataService } from '@vendure/admin-ui/core';

registerBulkAction({
  location: 'product-list',
  label: 'Assign to channel',
  // Only display this action if there are multiple channels
  isVisible: ({ injector }) => injector.get(DataService).client
    .userStatus()
    .mapSingle(({ userStatus }) => 1 < userStatus.channels.length)
    .toPromise(),
  // ...
});
```
### requiresPermission

<MemberInfo kind="property" type={`string | ((userPermissions: string[]) =&#62; boolean)`}   />

Control the display of this item based on the user permissions.

*Example*

```ts
registerBulkAction({
  // Can be specified as a simple string
  requiresPermission: Permission.UpdateProduct,

  // Or as a function that returns a boolean if permissions are satisfied
  requiresPermission: userPermissions =>
    userPermissions.includes(Permission.UpdateCatalog) ||
    userPermissions.includes(Permission.UpdateProduct),
  // ...
})
```


</div>


## BulkActionLocationId

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="12" packageName="@vendure/admin-ui" since="1.8.0" />

A valid location of a list view that supports the bulk actions API.

```ts title="Signature"
type BulkActionLocationId = | 'product-list'
    | 'facet-list'
    | 'collection-list'
    | 'customer-list'
    | 'customer-group-list'
    | 'customer-group-members-list'
    | 'customer-group-members-picker-list'
    | 'promotion-list'
    | 'seller-list'
    | 'channel-list'
    | 'administrator-list'
    | 'role-list'
    | 'shipping-method-list'
    | 'stock-location-list'
    | 'payment-method-list'
    | 'tax-category-list'
    | 'tax-rate-list'
    | 'zone-list'
    | 'zone-members-list'
    | string
```


## BulkActionFunctionContext

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="43" packageName="@vendure/admin-ui" since="1.8.0" />

This is the argument which gets passed to the `getTranslationVars` and `isVisible` functions
of the BulkAction definition.

```ts title="Signature"
interface BulkActionFunctionContext<ItemType, ComponentType> {
    selection: ItemType[];
    hostComponent: ComponentType;
    injector: Injector;
    route: ActivatedRoute;
}
```

<div className="members-wrapper">

### selection

<MemberInfo kind="property" type={`ItemType[]`}   />

An array of the selected items from the list.
### hostComponent

<MemberInfo kind="property" type={`ComponentType`}   />

The component instance that is hosting the list view. For instance,
`ProductListComponent`. This can be used to call methods on the instance,
e.g. calling `hostComponent.refresh()` to force a list refresh after
deleting the selected items.
### injector

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/injector#injector'>Injector</a>`}   />

The Angular [Injector](https://angular.io/api/core/Injector) which can be used
to get service instances which might be needed in the click handler.
### route

<MemberInfo kind="property" type={`ActivatedRoute`}   />




</div>


## BulkActionClickContext

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="74" packageName="@vendure/admin-ui" since="1.8.0" />

This is the argument which gets passed to the `onClick` function of a BulkAction.

```ts title="Signature"
interface BulkActionClickContext<ItemType, ComponentType> extends BulkActionFunctionContext<ItemType, ComponentType> {
    clearSelection: () => void;
    event: MouseEvent;
}
```
* Extends: <code><a href='/reference/admin-ui-api/bulk-actions/bulk-action#bulkactionfunctioncontext'>BulkActionFunctionContext</a>&#60;ItemType, ComponentType&#62;</code>



<div className="members-wrapper">

### clearSelection

<MemberInfo kind="property" type={`() =&#62; void`}   />

Clears the selection in the active list view.
### event

<MemberInfo kind="property" type={`MouseEvent`}   />

The click event itself.


</div>
