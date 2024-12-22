---
title: "GraphQL Dataloaders"
showtoc: true
---

[Dataloaders](https://github.com/graphql/dataloader) are used in GraphQL to solve the so called N+1 problem.

## N+1 problem

Imagine a cart with 20 items. Your database pool is configured to 15: enough to handle most sccenario's. Your implementation requires you to perform an `async` calculation `isSubscription` for each cart item that require one or more queries to be executed each time it executes. It works fine for a cart with 10 items. But with more than 15 items, suddenly the cart takes 20 seconds to load. 

The reason: the N+1 problem. Your cart is firing of 20 or more queries almost at the same time and is overwhelming your database pool. With 15 queries active in the pool, the next one has to wait until a slot becomes available in the pool, adding **significantly** to the query time. 

## The solution: dataloaders

Dataloaders allow you to say: instead of loading each field in the `grapqhl` tree one at a time, aggregate all the `ids` you want to execute the `async` calculation for, and then execute this for all the `ids` in one efficient `request`.

Dataloaders are often used on `fieldResolver`s. Often, you will need a specific dataloader for a each field resolver.

A Dataloader can return anything: `boolean`, `ProductVariant`, `string`, etc

## Performance implications

Dataloaders can have a huge impact on performance. If your `fieldResolver` executes queries, and you log these queries, you should see a cascade of queries before the implementation of the dataloader, change to a single query using multiple `ids` after you implement it.

## Do I need this for `CustomField` relations? 

No, not normally. `CustomField` relations are automatically added to the root query for the `entity` that they are part of. So, they are loaded as part of the query that loads that entity.

## Example

We will provider a complete example here for you to use as a starting point. The skeleton created can handle multiple dataloaders across multiple channels. We will implement a `fieldResolver` called `isSubscription` for an `OrderLine` that will return a `true/false` for each incoming `orderLine`, to indicate whether the `orderLine` represents a subscription.


```ts title="src/plugins/my-plugin/api/api-extensions.ts"
import gql from 'graphql-tag';

export const shopApiExtensions = gql`
    extend type OrderLine {
        isSubscription: Boolean!
    }
`
```

**Dataloader skeleton**

```ts title="src/plugins/my-plugin/api/datalaoder.ts"
import DataLoader from 'dataloader'

const LoggerCtx = 'SubscriptionDataloaderService'

@Injectable({ scope: Scope.REQUEST }) // Important! Dataloaders live at the request level
export class DataloaderService {

  /**
   * first level is channel identifier, second level is dataloader key
   */
  private loaders = new Map<string, Map<string, DataLoader<ID, any>>>()

  constructor(private service: SubscriptionExtensionService) {}

  getLoader(ctx: RequestContext, dataloaderKey: string) {
    const token = ctx.channel?.code ?? `${ctx.channelId}`
    
    Logger.debug(`Dataloader retrieval: ${token}, ${dataloaderKey}`)

    if (!this.loaders.has(token)) {
      this.loaders.set(token, new Map<string, DataLoader<ID, any>>())
    }

    const channelLoaders = this.loaders.get(token)!
    if (!channelLoaders.get(dataloaderKey)) {
      let loader: DataLoader<ID, any>

      switch (dataloaderKey) {
        case 'is-subscription':
          loader = new DataLoader<ID, any>((ids) =>
            this.batchLoadIsSubscription(ctx, ids as ID[]),
          )
          break
        default:
          throw new Error(`Unknown dataloader key ${dataloaderKey}`)
      }

      channelLoaders.set(dataloaderKey, loader)
    }
    return channelLoaders.get(dataloaderKey)!
  }

  private async batchLoadIsSubscription(
    ctx: RequestContext,
    ids: ID[],
  ): Promise<Boolean[]> {
    // returns a list of ids that represent those input ids that are subscriptions
    const subscriptionIds = await this.service.whichSubscriptions(ctx, ids)

    Logger.debug(`Dataloader is-subscription: ${ids}: ${subscriptionIds}`)

    return ids.map((id) => subscriptionIds.includes(id)) // Important! preserve order and count of input ids
  }
}
```


```ts title="src/plugins/my-plugin/api/entity-resolver.ts"
@Resolver(() => OrderLine)
export class MyPluginOrderLineEntityResolver {
  constructor(
    private dataloaderService: DataloaderService,
  ) {}

  @ResolveField()
  isSubscription(@Ctx() ctx: RequestContext, @Parent() parent: OrderLine) {
    const loader = this.dataloaderService.getLoader(ctx, 'is-subscription')
    return loader.load(parent.id)
  }
}
```

To make it all work, ensure that the `DataLoaderService` is loaded in your `plugin` as a provider.

:::tip
Dataloaders map the result in the same order as the `ids` you send to the dataloader. 
Dataloaders expect the same order and array size in the return result. 

In other words: ensure that the order of your returned result is the same as the incoming `ids` and don't omit values!
:::

