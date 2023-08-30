---
title: "BulkAction"
weight: 10
date: 2023-07-14T16:57:51.079Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# BulkAction
<div class="symbol">


# BulkAction

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="99" packageName="@vendure/admin-ui" since="1.8.0">}}

Configures a bulk action which can be performed on all selected items in a list view.

For a full example, see the <a href='/admin-ui-api/bulk-actions/register-bulk-action#registerbulkaction'>registerBulkAction</a> docs.

## Signature

```TypeScript
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
## Members

### location

{{< member-info kind="property" type="<a href='/admin-ui-api/bulk-actions/bulk-action#bulkactionlocationid'>BulkActionLocationId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### label

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### getTranslationVars

{{< member-info kind="property" type="(         context: <a href='/admin-ui-api/bulk-actions/bulk-action#bulkactionfunctioncontext'>BulkActionFunctionContext</a>&#60;ItemType, ComponentType&#62;,     ) =&#62; Record&#60;string, string | number&#62; | Promise&#60;Record&#60;string, string | number&#62;&#62;"  >}}

{{< member-description >}}An optional function that should resolve to a map of translation variables which can be
used when translating the `label` string.{{< /member-description >}}

### icon

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}A valid [Clarity Icons](https://core.clarity.design/foundation/icons/shapes/) icon shape, e.g.
"cog", "user", "info-standard".{{< /member-description >}}

### iconClass

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}A class to be added to the icon element. Examples:

- is-success
- is-danger
- is-warning
- is-info
- is-highlight{{< /member-description >}}

### onClick

{{< member-info kind="property" type="(context: <a href='/admin-ui-api/bulk-actions/bulk-action#bulkactionclickcontext'>BulkActionClickContext</a>&#60;ItemType, ComponentType&#62;) =&#62; void"  >}}

{{< member-description >}}Defines the logic that executes when the bulk action button is clicked.{{< /member-description >}}

### isVisible

{{< member-info kind="property" type="(context: <a href='/admin-ui-api/bulk-actions/bulk-action#bulkactionfunctioncontext'>BulkActionFunctionContext</a>&#60;ItemType, ComponentType&#62;) =&#62; boolean | Promise&#60;boolean&#62;"  >}}

{{< member-description >}}A function that determines whether this bulk action item should be displayed in the menu.
If not defined, the item will always be displayed.

This function will be invoked each time the selection is changed, so try to avoid expensive code
running here.

*Example*

```TypeScript
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
```{{< /member-description >}}

### requiresPermission

{{< member-info kind="property" type="string | ((userPermissions: string[]) =&#62; boolean)"  >}}

{{< member-description >}}Control the display of this item based on the user permissions.

*Example*

```TypeScript
registerBulkAction({
  // Can be specified as a simple string
  requiresPermission: Permission.UpdateProduct,

  // Or as a function that returns a boolean if permissions are satisfied
  requiresPermission: userPermissions =>
    userPermissions.includes(Permission.UpdateCatalog) ||
    userPermissions.includes(Permission.UpdateProduct),
  // ...
})
```{{< /member-description >}}


</div>
<div class="symbol">


# BulkActionLocationId

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="12" packageName="@vendure/admin-ui" since="1.8.0">}}

A valid location of a list view that supports the bulk actions API.

## Signature

```TypeScript
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
</div>
<div class="symbol">


# BulkActionFunctionContext

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="43" packageName="@vendure/admin-ui" since="1.8.0">}}

This is the argument which gets passed to the `getTranslationVars` and `isVisible` functions
of the BulkAction definition.

## Signature

```TypeScript
interface BulkActionFunctionContext<ItemType, ComponentType> {
  selection: ItemType[];
  hostComponent: ComponentType;
  injector: Injector;
  route: ActivatedRoute;
}
```
## Members

### selection

{{< member-info kind="property" type="ItemType[]"  >}}

{{< member-description >}}An array of the selected items from the list.{{< /member-description >}}

### hostComponent

{{< member-info kind="property" type="ComponentType"  >}}

{{< member-description >}}The component instance that is hosting the list view. For instance,
`ProductListComponent`. This can be used to call methods on the instance,
e.g. calling `hostComponent.refresh()` to force a list refresh after
deleting the selected items.{{< /member-description >}}

### injector

{{< member-info kind="property" type="<a href='/typescript-api/common/injector#injector'>Injector</a>"  >}}

{{< member-description >}}The Angular [Injector](https://angular.io/api/core/Injector) which can be used
to get service instances which might be needed in the click handler.{{< /member-description >}}

### route

{{< member-info kind="property" type="ActivatedRoute"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# BulkActionClickContext

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/bulk-action-registry/bulk-action-types.ts" sourceLine="74" packageName="@vendure/admin-ui" since="1.8.0">}}

This is the argument which gets passed to the `onClick` function of a BulkAction.

## Signature

```TypeScript
interface BulkActionClickContext<ItemType, ComponentType> extends BulkActionFunctionContext<ItemType, ComponentType> {
  clearSelection: () => void;
  event: MouseEvent;
}
```
## Extends

 * <a href='/admin-ui-api/bulk-actions/bulk-action#bulkactionfunctioncontext'>BulkActionFunctionContext</a>&#60;ItemType, ComponentType&#62;


## Members

### clearSelection

{{< member-info kind="property" type="() =&#62; void"  >}}

{{< member-description >}}Clears the selection in the active list view.{{< /member-description >}}

### event

{{< member-info kind="property" type="MouseEvent"  >}}

{{< member-description >}}The click event itself.{{< /member-description >}}


</div>
