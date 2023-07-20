---
title: "UiDevkitClient"
weight: 10
date: 2023-07-14T16:57:51.346Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# UiDevkitClient
<div class="symbol">


# setTargetOrigin

{{< generation-info sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="24" packageName="@vendure/ui-devkit">}}

Set the [window.postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
`targetOrigin`. The Vendure ui-devkit uses the postMessage API to
enable cross-frame and cross-origin communication between the ui extension code and the Admin UI
app. The `targetOrigin` is a security feature intended to provide control over where messages are sent.

## Signature

```TypeScript
function setTargetOrigin(value: string): void
```
## Parameters

### value

{{< member-info kind="parameter" type="string" >}}

</div>
<div class="symbol">


# getActivatedRoute

{{< generation-info sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="43" packageName="@vendure/ui-devkit">}}

Retrieves information about the current route of the host application, since it is not possible
to otherwise get this information from within the child iframe.

*Example*

```TypeScript
import { getActivatedRoute } from '@vendure/ui-devkit';

const route = await getActivatedRoute();
const slug = route.params.slug;
```

## Signature

```TypeScript
function getActivatedRoute(): Promise<ActiveRouteData>
```
</div>
<div class="symbol">


# graphQlQuery

{{< generation-info sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="70" packageName="@vendure/ui-devkit">}}

Perform a GraphQL query and returns either an Observable or a Promise of the result.

*Example*

```TypeScript
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

## Signature

```TypeScript
function graphQlQuery<T, V extends { [key: string]: any }>(document: string, variables?: { [key: string]: any }, fetchPolicy?: WatchQueryFetchPolicy): {
    then: Promise<T>['then'];
    stream: Observable<T>;
}
```
## Parameters

### document

{{< member-info kind="parameter" type="string" >}}

### variables

{{< member-info kind="parameter" type="{ [key: string]: any }" >}}

### fetchPolicy

{{< member-info kind="parameter" type="WatchQueryFetchPolicy" >}}

</div>
<div class="symbol">


# graphQlMutation

{{< generation-info sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="112" packageName="@vendure/ui-devkit">}}

Perform a GraphQL mutation and returns either an Observable or a Promise of the result.

*Example*

```TypeScript
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

## Signature

```TypeScript
function graphQlMutation<T, V extends { [key: string]: any }>(document: string, variables?: { [key: string]: any }): {
    then: Promise<T>['then'];
    stream: Observable<T>;
}
```
## Parameters

### document

{{< member-info kind="parameter" type="string" >}}

### variables

{{< member-info kind="parameter" type="{ [key: string]: any }" >}}

</div>
<div class="symbol">


# notify

{{< generation-info sourceFile="packages/ui-devkit/src/client/devkit-client-api.ts" sourceLine="147" packageName="@vendure/ui-devkit">}}

Display a toast notification.

*Example*

```TypeScript
import { notify } from '@vendure/ui-devkit';

notify({
  message: 'Updated Product',
  type: 'success'
});
```

## Signature

```TypeScript
function notify(options: NotificationMessage['data']): void
```
## Parameters

### options

{{< member-info kind="parameter" type="NotificationMessage['data']" >}}

</div>
