---
title: "Managing Sessions"
weight: 1
showtoc: true
---
 
# Managing Sessions

Vendure supports two ways to manage user sessions: cookies and bearer token. The method you choose depends on your requirements, and is specified by the [`authOptions.tokenMethod` property]({{< relref "auth-options" >}}#tokenmethod) of the VendureConfig.

## Cookie-based sessions (default)

Using cookies is the simpler approach for browser-based applications, since the browser will manage the cookies for you automatically. 

1. Enable the `credentials` option in your HTTP client. This allows the browser to send the session cookie with each request. 

    For example, if using a fetch-based client (such as [Apollo client](https://www.apollographql.com/docs/react/recipes/authentication/#cookie)) you would set `credentials: 'include'` or if using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials), you would set `withCredentials: true`

2. When using cookie-based sessions, you should set the [`authOptions.cookieOptions.secret` property]({{< relref "cookie-options" >}}#secret) to some secret string which will be used to sign the cookies sent to clients to prevent tampering. This string could be hard-coded in your config file, or (better) reside in an environment variable:

```TypeScript
const config = {
  // ...
  authOptions: {
    tokenMethod: 'cookie',
    cookieOptions: {
      secret: process.env.COOKIE_SESSION_SECRET
    }
  }
}
```

## Bearer-token sessions

In environments when cookies cannot be easily used (e.g. in some server environments or mobile apps), then the bearer-token method can be used.

Using bearer tokens involes a bit more work on your part: you'll need to manually read response headers to get the token, and once you have it you'll have to manually add it to the headers of each request. 

The workflow would be as follows:

1. Certain mutations and queries initiate a session (e.g. logging in, adding an item to an order etc.). When this happens, the response will contain a HTTP header which [by default is called `'vendure-auth-token'`]({{< relref "auth-options" >}}#authtokenheaderkey).
2. So your http client would need to check for the presence of this header each time it receives a response from the server.
3. If the `'vendure-auth-token'` header is present, read the value and store it because this is your bearer token.
4. Attach this bearer token to each subsequent request as `Authorization: Bearer <token>`.

Here's a simplified example of how that would look:

```TypeScript
const config = {
    // ...
    authOptions: {
        tokenMethod: 'bearer',
    }
}
```

```TypeScript
let token: string;

export async function request(query: string, variables: any) {
     // If we already know the token, set the Authorization header.
     const headers = token ? { Authorization: `Bearer ${token}` } : {};
     
     const response = await someGraphQlClient(query, variables, headers);
    
     // Check the response headers to see if Vendure has set the 
     // auth token. The header key "vendure-auth-token" may be set to
     // a custom value with the authOptions.authTokenHeaderKey config option.
     const authToken = response.headers.get('vendure-auth-token');
     if (authToken != null) {
         token = authToken;
     }
     return response.data;
}
```
