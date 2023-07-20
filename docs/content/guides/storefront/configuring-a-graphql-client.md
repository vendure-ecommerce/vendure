---
title: "Configuring a GraphQL Client"
weight: 2
showtoc: true
---

# Configuring a GraphQL Client

This guide provides examples of how to set up popular GraphQL clients to work with the Vendure Shop API. These examples are designed to work with both the `bearer` and `cookie` methods of [managing sessions]({{< relref "managing-sessions" >}}).

## Apollo Client

Here's an example configuration for [Apollo Client](https://www.apollographql.com/docs/react/) with a React app.

```TypeScript
import {
  ApolloClient,
  ApolloLink, 
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const AUTH_TOKEN_KEY = 'auth_token';

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_URL_SHOP_API}/shop-api`,
  withCredentials: true,
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const authHeader = context.response.headers.get('vendure-auth-token');
    if (authHeader) {
      // If the auth token has been returned by the Vendure
      // server, we store it in localStorage  
      localStorage.setItem(AUTH_TOKEN_KEY, authHeader);
    }
    return response;
  });
});

const client = new ApolloClient({
  link: ApolloLink.from([
    setContext(() => {
      const authToken = localStorage.getItem(AUTH_TOKEN_KEY)
      if (authToken) {
        // If we have stored the authToken from a previous
        // response, we attach it to all subsequent requests.  
        return {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      }
    }),
    afterwareLink,
    httpLink,
  ]),
  cache: new InMemoryCache(),
})

export default client;
```

## Urql

Here's an example using the [urql](https://formidable.com/open-source/urql/) client:

```tsx
import * as React from "react"
import { createClient, dedupExchange, fetchExchange, Provider } from "urql"
import { cacheExchange} from "@urql/exchange-graphcache"
import { makeOperation} from "@urql/core"

const AUTH_TOKEN_KEY = "auth_token"

const client = createClient({
  fetch: (input, init) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token) {
      const headers = input instanceof Request ? input.headers : init.headers;
      headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(input, init).then(response => {
      const token = response.headers.get("vendure-auth-token")
      if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token)
      }
      return response
    })
  },
  url: process.env.NEXT_PUBLIC_URL_SHOP_API,
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          addItemToOrder: (parent, args, cache) => {
            const activeOrder = cache.resolve('Query', 'activeOrder');
            if (activeOrder == null) {
              // The first time that the `addItemToOrder` mutation is called in a session,
              // the `activeOrder` query needs to be manually updated to point to the newly-created
              // Order type. From then on, the graphcache will handle keeping it up-to-date.
              cache.link('Query', 'activeOrder', parent.addItemToOrder);
            }
          },
        },
      },
    }),
    fetchExchange,
  ],
})

export const App = () => (
  <Provider value={client}><YourRoutes /></Provider>
)
```
