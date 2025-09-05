---
title: "Define a database entity"
showtoc: true
---

:::cli
Use `npx vendure add` to easily add a new entity to a plugin.
:::

Your plugin can define new database entities to model the data it needs to store. For instance, a product
review plugin would need a way to store reviews. This would be done by defining a new database entity.

This example shows how new [TypeORM database entities](https://typeorm.io/entities) can be defined by plugins.

## Create the entity class

```ts title="src/plugins/reviews/entities/product-review.entity.ts"
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity, Product, EntityId, ID } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
class ProductReview extends VendureEntity {
    constructor(input?: DeepPartial<ProductReview>) {
        super(input);
    }

    @ManyToOne(type => Product)
    product: Product;
    
    @EntityId()
    productId: ID;

    @Column()
    text: string;

    @Column()
    rating: number;
}
```

:::note
Any custom entities *must* extend the [`VendureEntity`](/reference/typescript-api/entities/vendure-entity/) class.
:::

In this example, we are making use of the following TypeORM decorators:

* [`@Entity()`](https://typeorm.io/decorator-reference#entity) - defines the entity as a TypeORM entity. This is **required** for all entities. It tells TypeORM to create a new table in the database for this entity.
* [`@Column()`](https://typeorm.io/decorator-reference#column) - defines a column in the database table. The data type of the column is inferred from the TypeScript type of the property, but can be overridden by passing an options object to the decorator. The `@Column()` also supports many other options for defining the column, such as `nullable`, `default`, `unique`, `primary`, `enum` etc.
* [`@ManyToOne()`](https://typeorm.io/decorator-reference#manytoone) - defines a many-to-one relationship between this entity and another entity. In this case, many  `ProductReview` entities can be associated with a given `Product`. There are other types of relations that can be defined - see the [TypeORM relations docs](https://typeorm.io/relations).

There is an additional Vendure-specific decorator:

* [`@EntityId()`](/reference/typescript-api/configuration/entity-id-decorator) marks a property as the ID of another entity. In this case, the `productId` property is the ID of the `Product` entity. The reason that we have a special decorator for this is that Vendure supports both numeric and string IDs, and the `@EntityId()` decorator will automatically set the database column to be the correct type. This `productId` is not _necessary_, but it is a useful convention to allow access to the ID of the associated entity without having to perform a database join.

## Register the entity

The new entity is then passed to the `entities` array of the VendurePlugin metadata:

```ts title="src/plugins/reviews/reviews-plugin.ts"
import { VendurePlugin } from '@vendure/core';
import { ProductReview } from './entities/product-review.entity';

@VendurePlugin({
    // highlight-next-line
    entities: [ProductReview],
})
export class ReviewsPlugin {}
```

:::note
Once you have added a new entity to your plugin, and the plugin has been added to your VendureConfig plugins array, you must create a [database migration](/guides/developer-guide/migrations/) to create the new table in the database.
:::

## Using the entity

The new entity can now be used in your plugin code. For example, you might want to create a new product review when a customer submits a review via the storefront:

```ts title="src/plugins/reviews/services/review.service.ts"
import { Injectable } from '@nestjs/common';
import { RequestContext, Product, TransactionalConnection } from '@vendure/core';

import { ProductReview } from '../entities/product-review.entity';

@Injectable()
export class ReviewService {
    constructor(private connection: TransactionalConnection) {}

    async createReview(ctx: RequestContext, productId: string, rating: number, text: string) {
        const product = await this.connection.getEntityOrThrow(ctx, Product, productId);
        // highlight-start
        const review = new ProductReview({
            product,
            rating,
            text,
        });
        return this.connection.getRepository(ctx, ProductReview).save(review);
        // highlight-end
    }
}
```

## Available entity decorators

In addition to the decorators described above, there are many other decorators provided by TypeORM. Some commonly used ones are:

- [`@OneToOne()`](https://typeorm.io/decorator-reference#onetoone)
- [`@OneToMany()`](https://typeorm.io/decorator-reference#onetomany)
- [`@ManyToMany()`](https://typeorm.io/decorator-reference#manytomany)
- [`@Index()`](https://typeorm.io/decorator-reference#index)
- [`@Unique()`](https://typeorm.io/decorator-reference#unique)

There is also another Vendure-specific decorator for representing monetary values specifically:

- [`@Money()`](/reference/typescript-api/money/money-decorator): This works together with the [`MoneyStrategy`](/reference/typescript-api/money/money-strategy) to allow configurable control over how monetary values are stored in the database. For more information see the [Money & Currency guide](/guides/core-concepts/money/#the-money-decorator).

:::info
The full list of TypeORM decorators can be found in the [TypeORM decorator reference](https://typeorm.io/decorator-reference)
:::


## Corresponding GraphQL type

Once you have defined a new DB entity, it is likely that you want to expose it in your GraphQL API. Here's how to [define a new type in your GraphQL API](/guides/developer-guide/extend-graphql-api/#defining-a-new-type).

## Supporting translations

In case you'd like to make the `ProductReview` entity support content in multiple languages, here's how to [implement the `Translatable` Interface](/guides/developer-guide/translatable).

## Supporting channels

In case you'd like to support separate `ProductReview` entities per Channel, here's how to [implement the `ChannelAware` Interface](/guides/developer-guide/channel-aware).

## Supporting custom fields

Just like you can extend Vendures native entities like `Product` to support your custom needs, you may enable other developers to extend your custom entities too! Here's how to [implement the `HasCustomFields` Interface](/guides/developer-guide/has-custom-fields).
