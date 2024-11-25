---
title: "EntityDuplicator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EntityDuplicator

<GenerationInfo sourceFile="packages/core/src/config/entity/entity-duplicator.ts" sourceLine="158" packageName="@vendure/core" since="2.2.0" />

An EntityDuplicator is used to define the logic for duplicating entities when the `duplicateEntity` mutation is called.
This allows you to add support for duplication of both core and custom entities.

*Example*

```ts title=src/config/custom-collection-duplicator.ts
import { Collection, LanguageCode, Permission
  EntityDuplicator, TransactionalConnection, CollectionService } from '@vendure/core';

let collectionService: CollectionService;
let connection: TransactionalConnection;

// This is just an example - we already ship with a built-in duplicator for Collections.
const customCollectionDuplicator = new EntityDuplicator({
    code: 'custom-collection-duplicator',
    description: [{ languageCode: LanguageCode.en, value: 'Custom collection duplicator' }],
    args: {
        throwError: {
            type: 'boolean',
            defaultValue: false,
        },
    },
    forEntities: ['Collection'],
    requiresPermission: [Permission.UpdateCollection],
    init(injector) {
        collectionService = injector.get(CollectionService);
        connection = injector.get(TransactionalConnection);
    },
    duplicate: async input => {
        const { ctx, id, args } = input;

        const original = await connection.getEntityOrThrow(ctx, Collection, id, {
            relations: {
                assets: true,
                featuredAsset: true,
            },
        });
        const newCollection = await collectionService.create(ctx, {
            isPrivate: original.isPrivate,
            customFields: original.customFields,
            assetIds: original.assets.map(a => a.id),
            featuredAssetId: original.featuredAsset?.id,
            parentId: original.parentId,
            filters: original.filters.map(f => ({
                code: f.code,
                arguments: f.args,
            })),
            inheritFilters: original.inheritFilters,
            translations: original.translations.map(t => ({
                languageCode: t.languageCode,
                name: `${t.name} (copy)`,
                slug: `${t.slug}-copy`,
                description: t.description,
                customFields: t.customFields,
            })),
        });

        if (args.throwError) {
            // If an error is thrown at any point during the duplication process, the entire
            // transaction will get automatically rolled back, and the mutation will return
            // an ErrorResponse containing the error message.
            throw new Error('Dummy error');
        }

        return newCollection;
    },
});
```

The duplicator then gets passed to your VendureConfig object:

```ts title=src/vendure-config.ts
import { VendureConfig, defaultEntityDuplicators } from '@vendure/core';
import { customCollectionDuplicator } from './config/custom-collection-duplicator';

export const config: VendureConfig = {
   // ...
   entityOptions: {
     entityDuplicators: [
         ...defaultEntityDuplicators,
         customCollectionDuplicator,
     ],
   },
};
```

```ts title="Signature"
class EntityDuplicator<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    constructor(config: EntityDuplicatorConfig<T>)
    duplicate(input: {
        ctx: RequestContext;
        entityName: string;
        id: ID;
        args: ConfigArg[];
    }) => Promise<VendureEntity>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/configuration/entity-duplicator#entityduplicatorconfig'>EntityDuplicatorConfig</a>&#60;T&#62;) => EntityDuplicator`}   />


### duplicate

<MemberInfo kind="method" type={`(input: {         ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>;         entityName: string;         id: <a href='/reference/typescript-api/common/id#id'>ID</a>;         args: ConfigArg[];     }) => Promise&#60;<a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>&#62;`}   />




</div>


## DuplicateEntityFn

<GenerationInfo sourceFile="packages/core/src/config/entity/entity-duplicator.ts" sourceLine="21" packageName="@vendure/core" since="2.2.0" />

A function which performs the duplication of an entity.

```ts title="Signature"
type DuplicateEntityFn<T extends ConfigArgs> = (input: {
    ctx: RequestContext;
    entityName: string;
    id: ID;
    args: ConfigArgValues<T>;
}) => Promise<VendureEntity>
```


## EntityDuplicatorConfig

<GenerationInfo sourceFile="packages/core/src/config/entity/entity-duplicator.ts" sourceLine="36" packageName="@vendure/core" since="2.2.0" />

Configuration for creating a new EntityDuplicator.

```ts title="Signature"
interface EntityDuplicatorConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    requiresPermission: Array<Permission | string> | Permission | string;
    forEntities: string[];
    duplicate: DuplicateEntityFn<T>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;</code>



<div className="members-wrapper">

### requiresPermission

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/common/permission#permission'>Permission</a> | string&#62; | <a href='/reference/typescript-api/common/permission#permission'>Permission</a> | string`}   />

The permissions required in order to execute this duplicator. If an array is passed,
then the administrator must have at least one of the permissions in the array.
### forEntities

<MemberInfo kind="property" type={`string[]`}   />

The entities for which this duplicator is able to duplicate.
### duplicate

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configuration/entity-duplicator#duplicateentityfn'>DuplicateEntityFn</a>&#60;T&#62;`}   />

The function which performs the duplication.

*Example*

```ts
duplicate: async input => {
  const { ctx, id, args } = input;

  // perform the duplication logic here

  return newEntity;
}
```


</div>
