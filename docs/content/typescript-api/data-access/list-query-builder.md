---
title: "ListQueryBuilder"
weight: 10
date: 2023-07-14T16:57:50.237Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ListQueryBuilder
<div class="symbol">


# ListQueryBuilder

{{< generation-info sourceFile="packages/core/src/service/helpers/list-query-builder/list-query-builder.ts" sourceLine="199" packageName="@vendure/core">}}

This helper class is used when fetching entities the database from queries which return a <a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a> type.
These queries all follow the same format:

In the GraphQL definition, they return a type which implements the `Node` interface, and the query returns a
type which implements the `PaginatedList` interface:

```GraphQL
type BlogPost implements Node {
  id: ID!
  published: DateTime!
  title: String!
  body: String!
}

type BlogPostList implements PaginatedList {
  items: [BlogPost!]!
  totalItems: Int!
}

# Generated at run-time by Vendure
input BlogPostListOptions

extend type Query {
   blogPosts(options: BlogPostListOptions): BlogPostList!
}
```
When Vendure bootstraps, it will find the `BlogPostListOptions` input and, because it is used in a query
returning a `PaginatedList` type, it knows that it should dynamically generate this input. This means
all primitive field of the `BlogPost` type (namely, "published", "title" and "body") will have `filter` and
`sort` inputs created for them, as well a `skip` and `take` fields for pagination.

Your resolver function will then look like this:

```TypeScript
@Resolver()
export class BlogPostResolver
  constructor(private blogPostService: BlogPostService) {}

  @Query()
  async blogPosts(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ): Promise<PaginatedList<BlogPost>> {
    return this.blogPostService.findAll(ctx, args.options || undefined);
  }
}
```

and the corresponding service will use the ListQueryBuilder:

```TypeScript
@Injectable()
export class BlogPostService {
  constructor(private listQueryBuilder: ListQueryBuilder) {}

  findAll(ctx: RequestContext, options?: ListQueryOptions<BlogPost>) {
    return this.listQueryBuilder
      .build(BlogPost, options)
      .getManyAndCount()
      .then(async ([items, totalItems]) => {
        return { items, totalItems };
      });
  }
}
```

## Signature

```TypeScript
class ListQueryBuilder implements OnApplicationBootstrap {
  constructor(connection: TransactionalConnection, configService: ConfigService)
  build(entity: Type<T>, options: ListQueryOptions<T> = {}, extendedOptions: ExtendedListQueryOptions<T> = {}) => SelectQueryBuilder<T>;
}
```
## Implements

 * OnApplicationBootstrap


## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService) => ListQueryBuilder"  >}}

{{< member-description >}}{{< /member-description >}}

### build

{{< member-info kind="method" type="(entity: Type&#60;T&#62;, options: ListQueryOptions&#60;T&#62; = {}, extendedOptions: <a href='/typescript-api/data-access/list-query-builder#extendedlistqueryoptions'>ExtendedListQueryOptions</a>&#60;T&#62; = {}) => SelectQueryBuilder&#60;T&#62;"  >}}

{{< member-description >}}Creates and configures a SelectQueryBuilder for queries that return paginated lists of entities.{{< /member-description >}}


</div>
<div class="symbol">


# ExtendedListQueryOptions

{{< generation-info sourceFile="packages/core/src/service/helpers/list-query-builder/list-query-builder.ts" sourceLine="40" packageName="@vendure/core">}}

Options which can be passed to the ListQueryBuilder's `build()` method.

## Signature

```TypeScript
type ExtendedListQueryOptions<T extends VendureEntity> = {
  relations?: string[];
  channelId?: ID;
  where?: FindOptionsWhere<T>;
  orderBy?: FindOneOptions<T>['order'];
  entityAlias?: string;
  ctx?: RequestContext;
  customPropertyMap?: { [name: string]: string };
  ignoreQueryLimits?: boolean;
}
```
## Members

### relations

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}{{< /member-description >}}

### channelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### where

{{< member-info kind="property" type="FindOptionsWhere&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### orderBy

{{< member-info kind="property" type="FindOneOptions&#60;T&#62;['order']"  >}}

{{< member-description >}}{{< /member-description >}}

### entityAlias

{{< member-info kind="property" type="string"  since="1.6.0" >}}

{{< member-description >}}Allows you to specify the alias used for the entity `T` in the generated SQL query.
Defaults to the entity class name lower-cased, i.e. `ProductVariant` -> `'productvariant'`.{{< /member-description >}}

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}When a RequestContext is passed, then the query will be
executed as part of any outer transaction.{{< /member-description >}}

### customPropertyMap

{{< member-info kind="property" type="{ [name: string]: string }"  >}}

{{< member-description >}}One of the main tasks of the ListQueryBuilder is to auto-generate filter and sort queries based on the
available columns of a given entity. However, it may also be sometimes desirable to allow filter/sort
on a property of a relation. In this case, the `customPropertyMap` can be used to define a property
of the `options.sort` or `options.filter` which does not correspond to a direct column of the current
entity, and then provide a mapping to the related property to be sorted/filtered.

Example: we want to allow sort/filter by and Order's `customerLastName`. The actual lastName property is
not a column in the Order table, it exists on the Customer entity, and Order has a relation to Customer via
`Order.customer`. Therefore, we can define a customPropertyMap like this:

*Example*

```GraphQL
"""
Manually extend the filter & sort inputs to include the new
field that we want to be able to use in building list queries.
"""
input OrderFilterParameter {
    customerLastName: StringOperators
}

input OrderSortParameter {
    customerLastName: SortOrder
}
```

*Example*

```ts
const qb = this.listQueryBuilder.build(Order, options, {
  relations: ['customer'],
  customPropertyMap: {
    // Tell TypeORM how to map that custom
    // sort/filter field to the property on a
    // related entity.
    customerLastName: 'customer.lastName',
  },
};
```
We can now use the `customerLastName` property to filter or sort
on the list query:

*Example*

```GraphQL
query {
  myOrderQuery(options: {
    filter: {
      customerLastName: { contains: "sm" }
    }
  }) {
    # ...
  }
}
```{{< /member-description >}}

### ignoreQueryLimits

{{< member-info kind="property" type="boolean" default="false"  since="2.0.2" >}}

{{< member-description >}}When set to `true`, the configured `shopListQueryLimit` and `adminListQueryLimit` values will be ignored,
allowing unlimited results to be returned. Use caution when exposing an unlimited list query to the public,
as it could become a vector for a denial of service attack if an attacker requests a very large list.{{< /member-description >}}


</div>
