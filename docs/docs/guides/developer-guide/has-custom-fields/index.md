---
title: "Implementing HasCustomFields"
showtoc: true
---

From Vendure v2.2, it is possible to add support for [custom fields](/guides/developer-guide/custom-fields/) to your custom entities. This
is useful when you are defining a custom entity as part of a plugin which is intended to be used by other developers. For example, a plugin
which defines a new entity for storing product reviews might want to allow the developer to add custom fields to the review entity.


## Defining entities that support custom fields

First you need to update your entity class to implement the `HasCustomFields` interface, and provide an empty class
which will be used to store the custom field values:

```ts title="src/plugins/reviews/entities/product-review.entity.ts"
import {
    DeepPartial,
    HasCustomFields,
    Product,
    VendureEntity,
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
    @Column(type => CustomProductReviewFields)
    customFields: CustomProductReviewFields;
    // highlight-end
    
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

TODO

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
