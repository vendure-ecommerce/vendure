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
    query(query: DocumentNode | TypedDocumentNode<T, V>, variables?: V, fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network', options: ExtendedQueryOptions = {}) => QueryResult<T, V>;
    mutate(mutation: DocumentNode | TypedDocumentNode<T, V>, variables?: V, update?: MutationUpdaterFn<T>, options: ExtendedQueryOptions = {}) => Observable<T>;
}
```

<div className="members-wrapper">

### query

<MemberInfo kind="method" type={`(query: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network', options: ExtendedQueryOptions = {}) => <a href='/reference/admin-ui-api/services/data-service#queryresult'>QueryResult</a>&#60;T, V&#62;`}   />

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

<MemberInfo kind="method" type={`(mutation: DocumentNode | TypedDocumentNode&#60;T, V&#62;, variables?: V, update?: MutationUpdaterFn&#60;T&#62;, options: ExtendedQueryOptions = {}) => Observable&#60;T&#62;`}   />

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

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/data/query-result.ts" sourceLine="31" packageName="@vendure/admin-ui" />

This class wraps the Apollo Angular QueryRef object and exposes some getters
for convenience.

```ts title="Signature"
class QueryResult<T, V extends Record<string, any> = Record<string, any>> {
    constructor(queryRef: QueryRef<T, V>, apollo: Apollo, customFieldMap: Map<string, CustomFieldConfig[]>)
    refetchOnChannelChange() => QueryResult<T, V>;
    refetchOnCustomFieldsChange(customFieldsToInclude$: Observable<string[]>) => QueryResult<T, V>;
    single$: Observable<T>
    stream$: Observable<T>
    ref: QueryRef<T, V>
    mapSingle(mapFn: (item: T) => R) => Observable<R>;
    mapStream(mapFn: (item: T) => R) => Observable<R>;
    destroy() => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(queryRef: QueryRef&#60;T, V&#62;, apollo: Apollo, customFieldMap: Map&#60;string, <a href='/reference/typescript-api/custom-fields/custom-field-config#customfieldconfig'>CustomFieldConfig</a>[]&#62;) => QueryResult`}   />


### refetchOnChannelChange

<MemberInfo kind="method" type={`() => <a href='/reference/admin-ui-api/services/data-service#queryresult'>QueryResult</a>&#60;T, V&#62;`}   />

Re-fetch this query whenever the active Channel changes.
### refetchOnCustomFieldsChange

<MemberInfo kind="method" type={`(customFieldsToInclude$: Observable&#60;string[]&#62;) => <a href='/reference/admin-ui-api/services/data-service#queryresult'>QueryResult</a>&#60;T, V&#62;`}  since="3.0.4"  />

Re-fetch this query whenever the custom fields change, updating the query to include the
specified custom fields.
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
### destroy

<MemberInfo kind="method" type={`() => `}   />

Signals to the internal Observable subscriptions that they should complete.


</div>
