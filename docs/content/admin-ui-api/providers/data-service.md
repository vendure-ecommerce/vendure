---
title: "DataService"
weight: 10
date: 2023-07-14T16:57:51.072Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DataService
<div class="symbol">


# DataService

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/data/providers/data.service.ts" sourceLine="33" packageName="@vendure/admin-ui">}}

Used to interact with the Admin API via GraphQL queries. Internally this service uses the
Apollo Client, which means it maintains a normalized entity cache. For this reason, it is
advisable to always select the `id` field of any entity, which will allow the returned data
to be effectively cached.

## Signature

```TypeScript
class DataService {
  query(query: DocumentNode | TypedDocumentNode<T, V>, variables?: V, fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network') => QueryResult<T, V>;
  mutate(mutation: DocumentNode | TypedDocumentNode<T, V>, variables?: V, update?: MutationUpdaterFn<T>) => Observable<T>;
}
```
## Members

### query

{{< member-info kind="method" type="(query: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network') => <a href='/admin-ui-api/providers/data-service#queryresult'>QueryResult</a>&#60;T, V&#62;"  >}}

{{< member-description >}}Perform a GraphQL query. Returns a <a href='/admin-ui-api/providers/data-service#queryresult'>QueryResult</a> which allows further control over
they type of result returned, e.g. stream of values, single value etc.

*Example*

```TypeScript
const result$ = this.dataService.query(gql`
  query MyQuery($id: ID!) {
    product(id: $id) {
      id
      name
      slug
    }
  },
  { id: 123 },
).mapSingle(data => data.product);
```{{< /member-description >}}

### mutate

{{< member-info kind="method" type="(mutation: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, update?: MutationUpdaterFn&#60;T&#62;) => Observable&#60;T&#62;"  >}}

{{< member-description >}}Perform a GraphQL mutation.

*Example*

```TypeScript
const result$ = this.dataService.mutate(gql`
  mutation MyMutation($Codegen.UpdateEntityInput!) {
    updateEntity(input: $input) {
      id
      name
    }
  },
  { Codegen.updateEntityInput },
);
```{{< /member-description >}}


</div>
<div class="symbol">


# QueryResult

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/data/query-result.ts" sourceLine="19" packageName="@vendure/admin-ui">}}

This class wraps the Apollo Angular QueryRef object and exposes some getters
for convenience.

## Signature

```TypeScript
class QueryResult<T, V extends Record<string, any> = Record<string, any>> {
  constructor(queryRef: QueryRef<T, V>, apollo: Apollo)
  completed$ = new Subject<void>();
  refetchOnChannelChange() => QueryResult<T, V>;
  single$: Observable<T>
  stream$: Observable<T>
  ref: QueryRef<T, V>
  mapSingle(mapFn: (item: T) => R) => Observable<R>;
  mapStream(mapFn: (item: T) => R) => Observable<R>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(queryRef: QueryRef&#60;T, V&#62;, apollo: Apollo) => QueryResult"  >}}

{{< member-description >}}{{< /member-description >}}

### completed$

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### refetchOnChannelChange

{{< member-info kind="method" type="() => <a href='/admin-ui-api/providers/data-service#queryresult'>QueryResult</a>&#60;T, V&#62;"  >}}

{{< member-description >}}Re-fetch this query whenever the active Channel changes.{{< /member-description >}}

### single$

{{< member-info kind="property" type="Observable&#60;T&#62;"  >}}

{{< member-description >}}Returns an Observable which emits a single result and then completes.{{< /member-description >}}

### stream$

{{< member-info kind="property" type="Observable&#60;T&#62;"  >}}

{{< member-description >}}Returns an Observable which emits until unsubscribed.{{< /member-description >}}

### ref

{{< member-info kind="property" type="QueryRef&#60;T, V&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### mapSingle

{{< member-info kind="method" type="(mapFn: (item: T) =&#62; R) => Observable&#60;R&#62;"  >}}

{{< member-description >}}Returns a single-result Observable after applying the map function.{{< /member-description >}}

### mapStream

{{< member-info kind="method" type="(mapFn: (item: T) =&#62; R) => Observable&#60;R&#62;"  >}}

{{< member-description >}}Returns a multiple-result Observable after applying the map function.{{< /member-description >}}


</div>
