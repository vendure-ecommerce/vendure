---
title: "Defining custom permissions"
showtoc: true
---

# Defining custom permissions

Your plugin may be defining new queries & mutations which require new permissions specific to those operations. This can be done by creating [PermissionDefinitions]({{< relref "permission-definition" >}}).

For example, let's imagine you are creating a plugin which exposes a new mutation that can be used by remote services to sync your inventory. First of all we will define the new permission:

```TypeScript
// sync-permission.ts
import { PermissionDefinition } from '@vendure/core';

export const sync = new PermissionDefinition({
  name: 'SyncInventory',
  description: 'Allows syncing stock levels via Admin API'
});
```

This permission can then be used in conjuction with the [@Allow() decorator]({{< relref "allow-decorator">}}) to limit access to the mutation:

```TypeScript
// inventory-sync.resolver.ts
import { Allow } from '@vendure/core';
import { Mutation, Resolver } from '@nestjs/graphql';
import { sync } from './sync-permission';

@Resolver()
export class InventorySyncResolver {

  @Allow(sync.Permission)
  @Mutation()
  syncInventory() {
    // ...
  }
}
```

Finally, the `sync` PermissionDefinition must be passed into the VendureConfig so that Vendure knows about this new custom permission:

```TypeScript {hl_lines=[21]}
// inventory-sync.plugin.ts
import gql from 'graphql-tag';
import { VendurePlugin } from '@vendure/core';
import { InventorySyncResolver } from './inventory-sync.resolver'
import { sync } from './sync-permission';

@VendurePlugin({
  adminApiExtensions: {
    schema: gql`
      input InventoryDataInput {
        # omitted for brevity
      }

      extend type Mutation {
        syncInventory(input: InventoryDataInput!): Boolean!
      }
    `,
    resolvers: [InventorySyncResolver]
  },
  configuration: config => {
    config.authOptions.customPermissions.push(sync);
    return config;
  },
})
export class InventorySyncPlugin {}
```

On starting the Vendure server, this custom permission will now be visible in the Role detail view of the Admin UI, and can be assigned to Roles.

## Custom CRUD permissions

Quite often your plugin will define a new entity on which you must perform create, read, update and delete (CRUD) operations. In this case, you can use the [CrudPermissionDefinition]({{< relref "permission-definition" >}}#crudpermissiondefinition) which simplifies the creation of the set of 4 CRUD permissions. See the docs for an example of usage.
