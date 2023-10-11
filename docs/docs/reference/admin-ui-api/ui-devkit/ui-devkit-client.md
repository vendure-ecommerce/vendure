---
title: "UiDevkitClient"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## setTargetOrigin

<GenerationInfo sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="24" packageName="@vendure/ui-devkit" />

Set the [window.postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
`targetOrigin`. The Vendure ui-devkit uses the postMessage API to
enable cross-frame and cross-origin communication between the ui extension code and the Admin UI
app. The `targetOrigin` is a security feature intended to provide control over where messages are sent.

```ts title="Signature"
function setTargetOrigin(value: string): void
```
Parameters

### value

<MemberInfo kind="parameter" type={`string`} />



## getActivatedRoute

<GenerationInfo sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="43" packageName="@vendure/ui-devkit" />

Retrieves information about the current route of the host application, since it is not possible
to otherwise get this information from within the child iframe.

*Example*

```ts
import { getActivatedRoute } from '@vendure/ui-devkit';

const route = await getActivatedRoute();
const slug = route.params.slug;
```

```ts title="Signature"
function getActivatedRoute(): Promise<ActiveRouteData>
```


## graphQlQuery

<GenerationInfo sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="70" packageName="@vendure/ui-devkit" />

Perform a GraphQL query and returns either an Observable or a Promise of the result.

*Example*

```ts
import { graphQlQuery } from '@vendure/ui-devkit';

const productList = await graphQlQuery(`
  query GetProducts($skip: Int, $take: Int) {
      products(options: { skip: $skip, take: $take }) {
          items { id, name, enabled },
          totalItems
      }
  }`, {
    skip: 0,
    take: 10,
  }).then(data => data.products);
```

```ts title="Signature"
function graphQlQuery<T, V extends { [key: string]: any }>(document: string, variables?: { [key: string]: any }, fetchPolicy?: WatchQueryFetchPolicy): {
    then: Promise<T>['then'];
    stream: Observable<T>;
}
```
Parameters

### document

<MemberInfo kind="parameter" type={`string`} />

### variables

<MemberInfo kind="parameter" type={`{ [key: string]: any }`} />

### fetchPolicy

<MemberInfo kind="parameter" type={`WatchQueryFetchPolicy`} />



## graphQlMutation

<GenerationInfo sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="112" packageName="@vendure/ui-devkit" />

Perform a GraphQL mutation and returns either an Observable or a Promise of the result.

*Example*

```ts
import { graphQlMutation } from '@vendure/ui-devkit';

const disableProduct = (id: string) => {
  return graphQlMutation(`
    mutation DisableProduct($id: ID!) {
      updateProduct(input: { id: $id, enabled: false }) {
        id
        enabled
      }
    }`, { id })
    .then(data => data.updateProduct)
}
```

```ts title="Signature"
function graphQlMutation<T, V extends { [key: string]: any }>(document: string, variables?: { [key: string]: any }): {
    then: Promise<T>['then'];
    stream: Observable<T>;
}
```
Parameters

### document

<MemberInfo kind="parameter" type={`string`} />

### variables

<MemberInfo kind="parameter" type={`{ [key: string]: any }`} />



## notify

<GenerationInfo sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="147" packageName="@vendure/ui-devkit" />

Display a toast notification.

*Example*

```ts
import { notify } from '@vendure/ui-devkit';

notify({
  message: 'Updated Product',
  type: 'success'
});
```

```ts title="Signature"
function notify(options: NotificationMessage['data']): void
```
Parameters

### options

<MemberInfo kind="parameter" type={`NotificationMessage['data']`} />

