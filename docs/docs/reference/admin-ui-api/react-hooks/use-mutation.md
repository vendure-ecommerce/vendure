---
title: "UseMutation"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useMutation

<GenerationInfo sourceFile="packages/admin-ui/src/lib/react/src/react-hooks/use-query.ts" sourceLine="104" packageName="@vendure/admin-ui" />

A React hook which allows you to execute a GraphQL mutation.

*Example*

```ts
import { useMutation } from '@vendure/admin-ui/react';
import { gql } from 'graphql-tag';

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
    id
    name
  }
}`;

export const MyComponent = () => {
    const [updateProduct, { data, loading, error }] = useMutation(UPDATE_PRODUCT);

    const handleClick = () => {
        updateProduct({
            input: {
                id: '1',
                name: 'New name',
            },
        }).then(result => {
            // do something with the result
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error! { error }</div>;

    return (
    <div>
        <button onClick={handleClick}>Update product</button>
        {data && <div>Product updated!</div>}
    </div>
    );
};
```

```ts title="Signature"
function useMutation<T, V extends Record<string, any> = Record<string, any>>(mutation: DocumentNode | TypedDocumentNode<T, V>): void
```
Parameters

### mutation

<MemberInfo kind="parameter" type={`DocumentNode | TypedDocumentNode&#60;T, V&#62;`} />

