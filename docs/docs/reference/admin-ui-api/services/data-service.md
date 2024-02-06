---
title: "DataService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DataService

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/data/providers/data.service.ts" sourceLine="33" packageName="@vendure/admin-ui" />

Used to interact with the Admin API via GraphQL queries. Internally this service uses the
Apollo Client, which means it maintains a normalized entity cache. For this reason, it is
advisable to always select the `id` field of any entity, which will allow the returned data
to be effectively cached.

```ts title="Signature"
class DataService {
    query(query: DocumentNode | TypedDocumentNode<T, V>, variables?: V, fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network') => QueryResult<T, V>;
    mutate(mutation: DocumentNode | TypedDocumentNode<T, V>, variables?: V, update?: MutationUpdaterFn<T>) => Observable<T>;
}
```

<div className="members-wrapper">

### query

<MemberInfo kind="method" type={`(query: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network') => <a href='/reference/admin-ui-api/services/data-service#queryresult'>QueryResult</a>&#60;T, V&#62;`}   />

Perform a GraphQL query. Returns a <a href='/reference/admin-ui-api/services/data-service#queryresult'>QueryResult</a> which allows further control over
they type of result returned, e.g. stream of values, single value etc.

*Example*

```ts
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
```
### mutate

<MemberInfo kind="method" type={`(mutation: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, update?: MutationUpdaterFn&#60;T&#62;) => Observable&#60;T&#62;`}   />

Perform a GraphQL mutation.

*Example*

```ts
const result$ = this.dataService.mutate(gql`
  mutation MyMutation($Codegen.UpdateEntityInput!) {
    updateEntity(input: $input) {
      id
      name
    }
  },
  { Codegen.updateEntityInput },
);
```


</div>


## QueryResult

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/data/query-result.ts" sourceLine="19" packageName="@vendure/admin-ui" />

This class wraps the Apollo Angular QueryRef object and exposes some getters
for convenience.

```ts title="Signature"
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

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(queryRef: QueryRef&#60;T, V&#62;, apollo: Apollo) => QueryResult`}   />


### completed$

<MemberInfo kind="property" type={``}   />


### refetchOnChannelChange

<MemberInfo kind="method" type={`() => <a href='/reference/admin-ui-api/services/data-service#queryresult'>QueryResult</a>&#60;T, V&#62;`}   />

Re-fetch this query whenever the active Channel changes.
### single$

<MemberInfo kind="property" type={`Observable&#60;T&#62;`}   />

Returns an Observable which emits a single result and then completes.
### stream$

<MemberInfo kind="property" type={`Observable&#60;T&#62;`}   />

Returns an Observable which emits until unsubscribed.
### ref

<MemberInfo kind="property" type={`QueryRef&#60;T, V&#62;`}   />


### mapSingle

<MemberInfo kind="method" type={`(mapFn: (item: T) =&#62; R) => Observable&#60;R&#62;`}   />

Returns a single-result Observable after applying the map function.
### mapStream

<MemberInfo kind="method" type={`(mapFn: (item: T) =&#62; R) => Observable&#60;R&#62;`}   />

Returns a multiple-result Observable after applying the map function.


</div>
