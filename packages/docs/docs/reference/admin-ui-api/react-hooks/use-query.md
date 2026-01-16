---
title: "UseQuery"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useQuery

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-query.ts" sourceLine="43" packageName="@vendure/admin-ui" />

A React hook which provides access to the results of a GraphQL query.

*Example*

```ts
import { useQuery } from '@vendure/admin-ui/react';
import { gql } from 'graphql-tag';

const GET_PRODUCT = gql`
   query GetProduct($id: ID!) {
     product(id: $id) {
       id
       name
       description
     }
   }`;

export const MyComponent = () => {
    const { data, loading, error } = useQuery(GET_PRODUCT, { id: '1' }, { refetchOnChannelChange: true });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error! { error }</div>;
    return (
        <div>
            <h1>{data.product.name}</h1>
            <p>{data.product.description}</p>
        </div>
    );
};
```

```ts title="Signature"
function useQuery<T, V extends Record<string, any> = Record<string, any>>(query: DocumentNode | TypedDocumentNode<T, V>, variables?: V, options: { refetchOnChannelChange: boolean } = { refetchOnChannelChange: false }): void
```
Parameters

### query

<MemberInfo kind="parameter" type={`DocumentNode | TypedDocumentNode&#60;T, V&#62;`} />

### variables

<MemberInfo kind="parameter" type={`V`} />

### options

<MemberInfo kind="parameter" type={`{ refetchOnChannelChange: boolean }`} />

