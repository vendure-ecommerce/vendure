---
title: "PermissionDefinition"
weight: 10
date: 2023-07-14T16:57:49.444Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PermissionDefinition
<div class="symbol">


# PermissionDefinition

{{< generation-info sourceFile="packages/core/src/common/permission-definition.ts" sourceLine="86" packageName="@vendure/core">}}

Defines a new Permission with which to control access to GraphQL resolvers & REST controllers.
Used in conjunction with the <a href='/typescript-api/request/allow-decorator#allow'>Allow</a> decorator (see example below).

**Note:** To define CRUD permissions, use the <a href='/typescript-api/auth/permission-definition#crudpermissiondefinition'>CrudPermissionDefinition</a>.

*Example*

```TypeScript
export const sync = new PermissionDefinition({
  name: 'SyncInventory',
  description: 'Allows syncing stock levels via Admin API'
});
```

```TypeScript
const config: VendureConfig = {
  authOptions: {
    customPermissions: [sync],
  },
}
```

```TypeScript
@Resolver()
export class ExternalSyncResolver {

  @Allow(sync.Permission)
  @Mutation()
  syncStockLevels() {
    // ...
  }
}
```

## Signature

```TypeScript
class PermissionDefinition {
  constructor(config: PermissionDefinitionConfig)
  Permission: Permission
}
```
## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/auth/permission-definition#permissiondefinitionconfig'>PermissionDefinitionConfig</a>) => PermissionDefinition"  >}}

{{< member-description >}}{{< /member-description >}}

### Permission

{{< member-info kind="property" type="<a href='/typescript-api/common/permission#permission'>Permission</a>"  >}}

{{< member-description >}}Returns the permission defined by this definition, for use in the
<a href='/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.{{< /member-description >}}


</div>
<div class="symbol">


# CrudPermissionDefinition

{{< generation-info sourceFile="packages/core/src/common/permission-definition.ts" sourceLine="146" packageName="@vendure/core">}}

Defines a set of CRUD Permissions for the given name, i.e. a `name` of 'Wishlist' will create
4 Permissions: 'CreateWishlist', 'ReadWishlist', 'UpdateWishlist' & 'DeleteWishlist'.

*Example*

```TypeScript
export const wishlist = new CrudPermissionDefinition('Wishlist');
```

```TypeScript
const config: VendureConfig = {
  authOptions: {
    customPermissions: [wishlist],
  },
}
```

```TypeScript
@Resolver()
export class WishlistResolver {

  @Allow(wishlist.Create)
  @Mutation()
  createWishlist() {
    // ...
  }
}
```

## Signature

```TypeScript
class CrudPermissionDefinition extends PermissionDefinition {
  constructor(name: string, descriptionFn?: (operation: 'create' | 'read' | 'update' | 'delete') => string)
  Create: Permission
  Read: Permission
  Update: Permission
  Delete: Permission
}
```
## Extends

 * <a href='/typescript-api/auth/permission-definition#permissiondefinition'>PermissionDefinition</a>


## Members

### constructor

{{< member-info kind="method" type="(name: string, descriptionFn?: (operation: 'create' | 'read' | 'update' | 'delete') =&#62; string) => CrudPermissionDefinition"  >}}

{{< member-description >}}{{< /member-description >}}

### Create

{{< member-info kind="property" type="<a href='/typescript-api/common/permission#permission'>Permission</a>"  >}}

{{< member-description >}}Returns the 'Create' CRUD permission defined by this definition, for use in the
<a href='/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.{{< /member-description >}}

### Read

{{< member-info kind="property" type="<a href='/typescript-api/common/permission#permission'>Permission</a>"  >}}

{{< member-description >}}Returns the 'Read' CRUD permission defined by this definition, for use in the
<a href='/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.{{< /member-description >}}

### Update

{{< member-info kind="property" type="<a href='/typescript-api/common/permission#permission'>Permission</a>"  >}}

{{< member-description >}}Returns the 'Update' CRUD permission defined by this definition, for use in the
<a href='/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.{{< /member-description >}}

### Delete

{{< member-info kind="property" type="<a href='/typescript-api/common/permission#permission'>Permission</a>"  >}}

{{< member-description >}}Returns the 'Delete' CRUD permission defined by this definition, for use in the
<a href='/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.{{< /member-description >}}


</div>
<div class="symbol">


# PermissionDefinitionConfig

{{< generation-info sourceFile="packages/core/src/common/permission-definition.ts" sourceLine="10" packageName="@vendure/core">}}

Configures a <a href='/typescript-api/auth/permission-definition#permissiondefinition'>PermissionDefinition</a>

## Signature

```TypeScript
interface PermissionDefinitionConfig {
  name: string;
  description?: string;
  assignable?: boolean;
  internal?: boolean;
}
```
## Members

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the permission. By convention this should be
UpperCamelCased.{{< /member-description >}}

### description

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}A description of the permission.{{< /member-description >}}

### assignable

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Whether this permission can be assigned to a Role. In general this
should be left as the default `true` except in special cases.{{< /member-description >}}

### internal

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}Internal permissions are not exposed via the API and are reserved for
special use-cases such at the `Owner` or `Public` permissions.{{< /member-description >}}


</div>
