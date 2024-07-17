---
title: "PermissionDefinition"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PermissionDefinition

<GenerationInfo sourceFile="packages/core/src/common/permission-definition.ts" sourceLine="86" packageName="@vendure/core" />

Defines a new Permission with which to control access to GraphQL resolvers & REST controllers.
Used in conjunction with the <a href='/reference/typescript-api/request/allow-decorator#allow'>Allow</a> decorator (see example below).

**Note:** To define CRUD permissions, use the <a href='/reference/typescript-api/auth/permission-definition#crudpermissiondefinition'>CrudPermissionDefinition</a>.

*Example*

```ts
export const sync = new PermissionDefinition({
  name: 'SyncInventory',
  description: 'Allows syncing stock levels via Admin API'
});
```

```ts
const config: VendureConfig = {
  authOptions: {
    customPermissions: [sync],
  },
}
```

```ts
@Resolver()
export class ExternalSyncResolver {

  @Allow(sync.Permission)
  @Mutation()
  syncStockLevels() {
    // ...
  }
}
```

```ts title="Signature"
class PermissionDefinition {
    constructor(config: PermissionDefinitionConfig)
    Permission: Permission
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/auth/permission-definition#permissiondefinitionconfig'>PermissionDefinitionConfig</a>) => PermissionDefinition`}   />


### Permission

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a>`}   />

Returns the permission defined by this definition, for use in the
<a href='/reference/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.


</div>


## CrudPermissionDefinition

<GenerationInfo sourceFile="packages/core/src/common/permission-definition.ts" sourceLine="146" packageName="@vendure/core" />

Defines a set of CRUD Permissions for the given name, i.e. a `name` of 'Wishlist' will create
4 Permissions: 'CreateWishlist', 'ReadWishlist', 'UpdateWishlist' & 'DeleteWishlist'.

*Example*

```ts
export const wishlist = new CrudPermissionDefinition('Wishlist');
```

```ts
const config: VendureConfig = {
  authOptions: {
    customPermissions: [wishlist],
  },
}
```

```ts
@Resolver()
export class WishlistResolver {

  @Allow(wishlist.Create)
  @Mutation()
  createWishlist() {
    // ...
  }
}
```

```ts title="Signature"
class CrudPermissionDefinition extends PermissionDefinition {
    constructor(name: string, descriptionFn?: (operation: 'create' | 'read' | 'update' | 'delete') => string)
    Create: Permission
    Read: Permission
    Update: Permission
    Delete: Permission
}
```
* Extends: <code><a href='/reference/typescript-api/auth/permission-definition#permissiondefinition'>PermissionDefinition</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(name: string, descriptionFn?: (operation: 'create' | 'read' | 'update' | 'delete') =&#62; string) => CrudPermissionDefinition`}   />


### Create

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a>`}   />

Returns the 'Create' CRUD permission defined by this definition, for use in the
<a href='/reference/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.
### Read

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a>`}   />

Returns the 'Read' CRUD permission defined by this definition, for use in the
<a href='/reference/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.
### Update

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a>`}   />

Returns the 'Update' CRUD permission defined by this definition, for use in the
<a href='/reference/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.
### Delete

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/permission#permission'>Permission</a>`}   />

Returns the 'Delete' CRUD permission defined by this definition, for use in the
<a href='/reference/typescript-api/request/allow-decorator#allow'>Allow</a> decorator.


</div>


## PermissionDefinitionConfig

<GenerationInfo sourceFile="packages/core/src/common/permission-definition.ts" sourceLine="10" packageName="@vendure/core" />

Configures a <a href='/reference/typescript-api/auth/permission-definition#permissiondefinition'>PermissionDefinition</a>

```ts title="Signature"
interface PermissionDefinitionConfig {
    name: string;
    description?: string;
    assignable?: boolean;
    internal?: boolean;
}
```

<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`}   />

The name of the permission. By convention this should be
UpperCamelCased.
### description

<MemberInfo kind="property" type={`string`}   />

A description of the permission.
### assignable

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Whether this permission can be assigned to a Role. In general this
should be left as the default `true` except in special cases.
### internal

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

Internal permissions are not exposed via the API and are reserved for
special use-cases such at the `Owner` or `Public` permissions.


</div>
