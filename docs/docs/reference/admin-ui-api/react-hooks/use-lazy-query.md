---
title: "UseLazyQuery"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useLazyQuery

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-query.ts" sourceLine="113" packageName="@vendure/admin-ui" since="2.2.0" />

A React hook which allows you to execute a GraphQL query.

*Example*

```ts
import { useLazyQuery } from '@vendure/admin-ui/react';
import { gql } from 'graphql-tag';

const GET_PRODUCT = gql`
   query GetProduct($id: ID!) {
     product(id: $id) {
       id
       name
       description
     }
   }`;
type ProductResponse = {
    product: {
        name: string
        description: string
    }
}

export const MyComponent = () => {
    const [getProduct, { data, loading, error }] = useLazyQuery<ProductResponse>(GET_PRODUCT);

   const handleClick = () => {
        getProduct({
             id: '1',
        }).then(result => {
            // do something with the result
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error! { error }</div>;

    return (
    <div>
        <button onClick={handleClick}>Get product</button>
        {data && (
             <div>
                 <h1>{data.product.name}</h1>
                 <p>{data.product.description}</p>
             </div>)}
    </div>
    );
};
```

```ts title="Signature"
function useLazyQuery<T, V extends Record<string, any> = Record<string, any>>(query: DocumentNode | TypedDocumentNode<T, V>): void
```
Parameters

### query

<MemberInfo kind="parameter" type={`DocumentNode | TypedDocumentNode&#60;T, V&#62;`} />

