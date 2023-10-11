---
title: "Migrating from v1"
weight: 2
sidebar_position: 1
---

# Migrating from Vendure 1 to 2

This section contains guides for migrating from Vendure v1 to v2.

There are a number of breaking changes between the two versions, which are due to a few major factors:

1. To support new features such as multi-vendor marketplace APIs and multiple stock locations, we had to make some changes to the database schema and some of the internal APIs.
2. We have updated all of our major dependencies to their latest versions. Some of these updates involve breaking changes in the dependencies themselves, and in those cases where you are using those dependencies directly (most notably TypeORM), you will need to make the corresponding changes to your code.
3. We have removed some old APIs which were previously marked as "deprecated".

## Migration steps

Migration will consist of these main steps:

1. **Update your Vendure dependencies** to the latest versions
   ```diff
   {
     // ...
     "dependencies": {
   -    "@vendure/common": "1.9.7",
   -    "@vendure/core": "1.9.7",
   +    "@vendure/common": "2.0.0",
   +    "@vendure/core": "2.0.0",
        // etc.
     },
     "devDependencies": {
   -    "typescript": "4.3.5",
   +    "typescript": "4.9.5",
        // etc.
     }
   }
   ```
2. **Migrate your database**. This is covered in detail in the [database migration section](/guides/developer-guide/migrating-from-v1/database-migration).
3. **Update your custom code** (configuration, plugins, admin ui extensions) to handle the breaking changes. Details of these changes are covered in the [breaking API changes section](/guides/developer-guide/migrating-from-v1/breaking-api-changes).
4. **Update your storefront** to handle some small breaking changes in the Shop GraphQL API. See the [storefront migration section](/guides/developer-guide/migrating-from-v1/storefront-migration) for details.
