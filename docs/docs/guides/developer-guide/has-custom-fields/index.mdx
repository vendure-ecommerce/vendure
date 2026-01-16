---
title: "Implementing HasCustomFields"
showtoc: true
---

From Vendure v2.2, it is possible to add support for [custom fields](/guides/developer-guide/custom-fields/) to your custom entities. This is useful when you are defining a custom entity as part of a plugin which is intended to be used by other developers. For example, a plugin which defines a new entity for storing product reviews might want to allow the developer to add custom fields to the review entity.

## Defining entities that support custom fields

First you need to update your entity class to implement the `HasCustomFields` interface, and provide an empty class
which will be used to store the custom field values:

```ts title="src/plugins/reviews/entities/product-review.entity.ts"
import {
    DeepPartial,
    HasCustomFields,
    Product,
    VendureEntity,
    ID,
    EntityId,
} from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';

// highlight-next-line
export class CustomProductReviewFields {}

@Entity()
// highlight-next-line
export class ProductReview extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ProductReview>) {
        super(input);
    }

    // highlight-start
    @Column(() => CustomProductReviewFields)
    customFields: CustomProductReviewFields;
    // highlight-end
    
    @ManyToOne(() => Product)
    product: Product;

    @EntityId()
    productId: ID;

    @Column()
    text: string;

    @Column()
    rating: number;
}
```

### Type generation

Given the above entity your [API extension](/guides/developer-guide/extend-graphql-api/) might look like this:

```graphql
type ProductReview implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!

  product: Product!
  productId: ID!
  text: String!
  rating: Int!
}

input CreateProductReviewInput {
  productId: ID!
  text: String!
  rating: Int!
}

input UpdateProductReviewInput {
  id: ID!
  productId: ID
  text: String
  rating: Int
}
```

Notice the lack of manually defining `customFields` on the types, this is because Vendure extends the types automatically once your entity implements `HasCustomFields`.

:::important Naming convention
In order for Vendure to find the correct input types to extend to, they must conform to the naming convention of:

- `Create<EntityName>Input`
- `Update<EntityName>Input`

And if your entity is [supporting translations](/guides/developer-guide/translatable):

- `<EntityName>Translation`
- `<EntityName>TranslationInput`
- `Create<EntityName>TranslationInput`
- `Update<EntityName>TranslationInput`
:::

Following this caveat, codegen will now produce correct types including `customFields`-fields like so:

```ts
export type ProductReview = Node & {
  // highlight-next-line
  customFields?: Maybe<Scalars['JSON']['output']>;
  // Note: Other fields omitted for brevity
}

export type CreateProductReviewInput = {
  // highlight-next-line
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  // Note: Other fields omitted for brevity
}

export type UpdateProductReviewInput = {
  // highlight-next-line
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  // Note: Other fields omitted for brevity
}
```

## Supporting custom fields in your services

Creating and updating your entity works now by setting the fields like usual, with one important addition being, you mustn't forget to update relations via the `CustomFieldRelationService`. This is needed because a consumer of your plugin may extend the entity with custom fields of type [`relation`](/guides/developer-guide/custom-fields/#properties-for-relation-fields) which need to get saved separately.

```ts title="src/plugins/reviews/services/review.service.ts"
import { Injectable } from '@nestjs/common';
import { RequestContext, Product, TransactionalConnection, CustomFieldRelationService } from '@vendure/core';

import { ProductReview } from '../entities/product-review.entity';

@Injectable()
export class ReviewService {
    constructor(
      private connection: TransactionalConnection,
      // highlight-next-line
      private customFieldRelationService: CustomFieldRelationService,
    ) {}

    async create(ctx: RequestContext, input: CreateProductReviewInput) {
        const product = await this.connection.getEntityOrThrow(ctx, Product, input.productId);
        // You'll probably want to do more validation/logic here in a real world scenario
        
        // highlight-start
        const review = new ProductReview({ ...input, product });
        const savedEntity = await this.connection.getRepository(ctx, ProductReview).save(review);
        await this.customFieldRelationService.updateRelations(ctx, ProductReview, input, savedEntity);
        // highlight-end

        return savedEntity;
    }
}
```

## Updating config

Now you'll be able to add custom fields to the `ProductReview` entity via the VendureConfig:

```ts title="src/vendure-config.ts"
import { VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
    // ...
    customFields: {
        ProductReview: [
            { name: 'reviewerName', type: 'string' },
            { name: 'reviewerLocation', type: 'string' },
        ],
    },
};
```

## Migrations

Extending entities will alter the database schema requiring a migration. See the [migrations guide](/guides/developer-guide/migrations/) for further details.
