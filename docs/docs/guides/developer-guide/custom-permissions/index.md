---
title: "Define custom permissions"
showtoc: true
---

Vendure uses a fine-grained access control system based on roles & permissions. This is described in detail in the [Auth guide](/guides/core-concepts/auth/). The built-in [`Permission` enum](/reference/typescript-api/common/permission/) includes a range of permissions to control create, read, update, and delete access to the built-in entities.

When building plugins, you may need to define new permissions to control access to new functionality. This guide explains how to do so.

## Defining a single permission

For example, let's imagine you are creating a plugin which exposes a new mutation that can be used by remote services to sync your inventory. First of all we will define the new permission using the [`PermissionDefinition`](/reference/typescript-api/auth/permission-definition/) class:

```ts title="src/plugins/inventory-sync/constants.ts"
import { PermissionDefinition } from '@vendure/core';

export const sync = new PermissionDefinition({
    name: 'SyncInventory',
    description: 'Allows syncing stock levels via Admin API'
});
```

This permission can then be used in conjuction with the [@Allow() decorator](/reference/typescript-api/request/allow-decorator/) to limit access to the mutation:

```ts title="src/plugins/inventory-sync/api/inventory-sync.resolver.ts"
import { Mutation, Resolver } from '@nestjs/graphql';
import { Allow } from '@vendure/core';
import { sync } from '../constants';

@Resolver()
export class InventorySyncResolver {

    // highlight-next-line
    @Allow(sync.Permission)
    @Mutation()
    syncInventory(/* ... */) {
        // ...
    }
}
```

Finally, the `sync` PermissionDefinition must be passed into the VendureConfig so that Vendure knows about this new custom permission:

```ts title="src/plugins/inventory-sync/inventory-sync.plugin.ts"
import gql from 'graphql-tag';
import { VendurePlugin } from '@vendure/core';

import { InventorySyncResolver } from './api/inventory-sync.resolver'
import { sync } from './constants';

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
        // highlight-next-line
        config.authOptions.customPermissions.push(sync);
        return config;
    },
})
export class InventorySyncPlugin {}
```

On starting the Vendure server, this custom permission will now be visible in the Role detail view of the Admin UI, and can be assigned to Roles.

## Custom CRUD permissions

Quite often your plugin will define a new entity on which you must perform create, read, update and delete (CRUD) operations. In this case, you can use the [CrudPermissionDefinition](/reference/typescript-api/auth/permission-definition/#crudpermissiondefinition) which simplifies the creation of the set of 4 CRUD permissions. 

For example, let's imagine we are creating a plugin which adds a new entity called `ProductReview`. We can define the CRUD permissions like so:

```ts title="src/plugins/product-review/constants.ts"
import { CrudPermissionDefinition } from '@vendure/core';

export const productReview = new CrudPermissionDefinition('ProductReview');
```

These permissions can then be used in our resolver:

```ts title="src/plugins/product-review/api/product-review.resolver.ts"
import { Mutation, Resolver } from '@nestjs/graphql';
import { Allow, Transaction } from '@vendure/core';
import { productReview } from '../constants';

@Resolver()
export class ProductReviewResolver {

    // highlight-next-line
    @Allow(productReview.Read)
    @Query()
    productReviews(/* ... */) {
        // ...
    }
    
    // highlight-next-line
    @Allow(productReview.Create)
    @Mutation()
    @Transaction()
    createProductReview(/* ... */) {
        // ...
    }
    
    // highlight-next-line
    @Allow(productReview.Update)
    @Mutation()
    @Transaction()
    updateProductReview(/* ... */) {
        // ...
    }
    
    // highlight-next-line
    @Allow(productReview.Delete)
    @Mutation()
    @Transaction()
    deleteProductReview(/* ... */) {
        // ...
    }
}
```

Finally, the `productReview` CrudPermissionDefinition must be passed into the VendureConfig so that Vendure knows about this new custom permission:

```ts title="src/plugins/product-review/product-review.plugin.ts"
import gql from 'graphql-tag';
import { VendurePlugin } from '@vendure/core';

import { ProductReviewResolver } from './api/product-review.resolver'
import { productReview } from './constants';

@VendurePlugin({
    adminApiExtensions: {
        schema: gql`
            # omitted for brevity
        `,
        resolvers: [ProductReviewResolver]
    },
    configuration: config => {
        // highlight-next-line
        config.authOptions.customPermissions.push(productReview);
        return config;
    },
})
export class ProductReviewPlugin {}
```
