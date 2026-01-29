---
title: "Implementing Translatable"
showtoc: true
---

## Defining translatable entities

Making an entity translatable means that string properties of the entity can have a different values for multiple languages.
To make an entity translatable, you need to implement the [`Translatable`](/reference/typescript-api/entities/interfaces/#translatable) interface and add a `translations` property to the entity.

```ts title="src/plugins/requests/entities/product-request.entity.ts"
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity, Product, EntityId, ID, Translatable } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';

import { ProductRequestTranslation } from './product-request-translation.entity';

@Entity()
class ProductRequest extends VendureEntity implements Translatable {
    constructor(input?: DeepPartial<ProductRequest>) {
        super(input);
    }
// highlight-start
    text: LocaleString;
// highlight-end
    
    @ManyToOne(type => Product)
    product: Product;

    @EntityId()
    productId: ID;


// highlight-start
    @OneToMany(() => ProductRequestTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<ProductRequest>>;
// highlight-end
}
```

The `translations` property is a `OneToMany` relation to the translations. Any fields that are to be translated are of type `LocaleString`, and **do not have a `@Column()` decorator**.
This is because the `text` field here does not in fact exist in the database in the `product_request` table. Instead, it belongs to the `product_request_translations` table of the `ProductRequestTranslation` entity:

```ts title="src/plugins/requests/entities/product-request-translation.entity.ts"
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { HasCustomFields, Translation, VendureEntity, LanguageCode } from '@vendure/core';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { ProductRequest } from './release-note.entity';

@Entity()
export class ProductRequestTranslation
    extends VendureEntity
    implements Translation<ProductRequest>, HasCustomFields
{
    constructor(input?: DeepPartial<Translation<ProductRequestTranslation>>) {
        super(input);
    }

    @Column('varchar')
    languageCode: LanguageCode;

    @Column('varchar')
// highlight-start
    text: string; // same name as the translatable field in the base entity
// highlight-end
    @Index()
    @ManyToOne(() => ProductRequest, base => base.translations, { onDelete: 'CASCADE' })
    base: ProductRequest;
}
```

Thus there is a one-to-many relation between `ProductRequest` and `ProductRequestTranslation`, which allows Vendure to handle multiple translations of the same entity. The `ProductRequestTranslation` entity also implements the `Translation` interface, which requires the `languageCode` field and a reference to the base entity.

### Translations in the GraphQL schema
Since the `text` field is getting hydrated with the translation it should be exposed in the GraphQL Schema. Additionally, the `ProductRequestTranslation` type should
be defined as well, to access other translations as well:
```graphql title="src/plugins/requests/api/types.ts"
type ProductRequestTranslation {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
// highlight-start
    languageCode: LanguageCode!
    text: String!
// highlight-end
}

type ProductRequest implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    # Will be filled with the translation for the current language
    text: String!
// highlight-next-line
    translations: [ProductRequestTranslation!]!
}

```

## Creating translatable entities

Creating a translatable entity is usually done by using the [`TranslatableSaver`](/reference/typescript-api/service-helpers/translatable-saver/). This injectable service provides a `create` and `update` method which can be used to save or update a translatable entity.

```ts title="src/plugins/requests/service/product-request.service.ts"
export class RequestService {

    constructor(private translatableSaver: TranslatableSaver) {}

    async create(ctx: RequestContext, input: CreateProductRequestInput): Promise<ProductRequest> {
        const request = await this.translatableSaver.create({
            ctx,
            input,
            entityType: ProductRequest,
            translationType: ProductRequestTranslation,
            beforeSave: async f => {
                // Assign relations here
            },
        });
        return request;
    }
}
```

Important for the creation of translatable entities is the input object. The input object should contain a `translations` array with the translations for the entity. This can be done
by defining the types like `CreateRequestInput` inside the GraphQL schema:

```graphql title="src/plugins/requests/api/types.ts"
input ProductRequestTranslationInput {
    # Only defined for update mutations
    id: ID
// highlight-start
    languageCode: LanguageCode!
    text: String!
// highlight-end
}

input CreateProductRequestInput {
    text: String!
// highlight-next-line
    translations: [ProductRequestTranslationInput!]!
}
```

## Updating translatable entities

Updating a translatable entity is done in a similar way as creating one. The [`TranslatableSaver`](/reference/typescript-api/service-helpers/translatable-saver/) provides an `update` method which can be used to update a translatable entity.

```ts title="src/plugins/requests/service/product-request.service.ts"
export class RequestService {

    constructor(private translatableSaver: TranslatableSaver) {}

    async update(ctx: RequestContext, input: UpdateProductRequestInput): Promise<ProductRequest> {
        const updatedEntity = await this.translatableSaver.update({
            ctx,
            input,
            entityType: ProductRequest,
            translationType: ProductRequestTranslation,
            beforeSave: async f => {
                // Assign relations here
            },
        });
        return updatedEntity;
    }
}
```

Once again it's important to provide the `translations` array in the input object. This array should contain the translations for the entity.

```graphql title="src/plugins/requests/api/types.ts"

input UpdateProductRequestInput {
    text: String
// highlight-next-line
    translations: [ProductRequestTranslationInput!]
}
```

## Loading translatable entities

If your plugin needs to load a translatable entity, you will need to use the [`TranslatorService`](/reference/typescript-api/service-helpers/translator-service/) to hydrate all the `LocaleString` fields will the actual translated values from the correct translation.

```ts title="src/plugins/requests/service/product-request.service.ts"
export class RequestService {

    constructor(private translator: TranslatorService) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<ProductRequest>,
        relations?: RelationPaths<ProductRequest>,
    ): Promise<PaginatedList<Translated<ProductRequest>>> {
        return this.listQueryBuilder
            .build(ProductRequest, options, {
                relations,
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
// highlight-next-line
                    items: items.map(item => this.translator.translate(item, ctx)),
                    totalItems,
                };
            });
    }
    
    findOne(
        ctx: RequestContext,
        id: ID,
        relations?: RelationPaths<ProductRequest>,
    ): Promise<Translated<ProductRequest> | null> {
        return this.connection
            .getRepository(ctx, ProductRequest)
            .findOne({
                where: { id },
                relations,
            })
// highlight-next-line
            .then(entity => entity && this.translator.translate(entity, ctx));
    }
}
```
