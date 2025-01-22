---
title: "Implementing ChannelAware"
showtoc: true
---

## Defining channel-aware entities

Making an entity channel-aware means that it can be associated with a specific [Channel](/reference/typescript-api/entities/channel).
This is useful when you want to have different data or features for different channels. First you will have to create
an entity ([Define a database entity](/guides/developer-guide/database-entity/)) that implements the `ChannelAware` interface.
This interface requires the entity to provide a `channels` property

```ts title="src/plugins/requests/entities/product-request.entity.ts"
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { VendureEntity, Product, EntityId, ID, ChannelAware } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
class ProductRequest extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<ProductRequest>) {
        super(input);
    }

    @ManyToOne(type => Product)
    product: Product;

    @EntityId()
    productId: ID;

    @Column()
    text: string;
    
    // highlight-start
    @ManyToMany(() => Channel)
    @JoinTable()
    channels: Channel[];
    // highlight-end
}
```

## Creating channel-aware entities

Creating a channel-aware entity is similar to creating a regular entity. The only difference is that you need to assign the entity to the current channel.
This can be done by using the `ChannelService` which provides the `assignToCurrentChannel` helper function. 

:::info
The `assignToCurrentChannel` function will only assign the `channels` property of the entity. You will still need to save the entity to the database.
:::

```ts title="src/plugins/requests/service/product-request.service.ts"
import { ChannelService } from '@vendure/core';

export class RequestService {

    constructor(private channelService: ChannelService) {}

    async create(ctx: RequestContext, input: CreateRequestInput): Promise<ProductRequest> {
        const request = new ProductRequest(input);
        // Now we need to assign the request to the current channel (+ default channel)
// highlight-next-line
        await this.channelService.assignToCurrentChannel(input, ctx);
        
        return await this.connection.getRepository(ProductRequest).save(request);
    }
}
```
For [Translatable entities](/guides/developer-guide/translations/), the best place to assign the channels is inside the `beforeSave` input of the [TranslateableSave](/reference/typescript-api/service-helpers/translatable-saver/) helper class.


## Querying channel-aware entities

When querying channel-aware entities, you can use the [ListQueryBuilder](/reference/typescript-api/data-access/list-query-builder/#extendedlistqueryoptions) or
the [TransactionalConnection](/reference/typescript-api/data-access/transactional-connection/#findoneinchannel) to automatically filter entities based on the provided channel id.


```ts title="src/plugins/requests/service/product-request.service.ts"
import { ChannelService, ListQueryBuilder, TransactionalConnection } from '@vendure/core';

export class RequestService {

    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private channelService: ChannelService) {}

    findOne(ctx: RequestContext,
            requestId: ID,
            relations?: RelationPaths<ProductRequest>) {
// highlight-start
        return this.connection.findOneInChannel(ctx, ProductRequest, requestId, ctx.channelId, {
            relations: unique(effectiveRelations)
        });
// highlight-end
    }

    findAll(
        ctx: RequestContext,
        options?: ProductRequestListOptions,
        relations?: RelationPaths<ProductRequest>,
    ): Promise<PaginatedList<ProductRequest>> {
        return this.listQueryBuilder
            .build(ProductRequest, options, {
                ctx,
                relations,
// highlight-next-line
                channelId: ctx.channelId,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }
}
```
