---
title: "Defining a new database entity"
showtoc: true
---

# Defining a new database entity

This example shows how new [TypeORM database entities](https://typeorm.io/entities) can be defined by plugins.

```TypeScript
// product-review.entity.ts
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity } from '@vendure/core';
import { Column, Entity } from 'typeorm';

@Entity()
class ProductReview extends VendureEntity {
  constructor(input?: DeepPartial<ProductReview>) {
    super(input);
  }

  @Column()
  text: string;
  
  @Column()
  rating: number;
}
```

{{< alert "primary" >}}
  **Note** Any custom entities *must* extend the [`VendureEntity`]({{< relref "vendure-entity" >}}) class.
{{< /alert >}}

The new entity is then passed to the `entities` array of the VendurePlugin metadata:

```TypeScript {hl_lines=[6]}
// reviews-plugin.ts
import { VendurePlugin } from '@vendure/core';
import { ProductReview } from './product-review.entity';

@VendurePlugin({
  entities: [ProductReview],
})
export class ReviewsPlugin {}
```

## Corresponding GraphQL type

Once you have defined a new DB entity, it is likely that you want to expose it in your GraphQL API. Here's how to [define a new type in your GraphQL API]({{< relref "extending-graphql-api" >}}#defining-a-new-type).
