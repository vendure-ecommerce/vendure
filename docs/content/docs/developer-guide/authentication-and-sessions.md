---
title: "Authentication & Sessions"
weight: 0
showtoc: true
---
 
# Authentication & Sessions

Vendure supports two ways to manage user sessions: cookies and bearer token. The method you choose depends on your requirements, and is specified by the [`authOptions.tokenMethod` property]({{< relref "auth-options" >}}#tokenmethod) of the VendureConfig.

## Cookie-based sessions (default)

Using cookies is the simpler approach for browser-based applications, since the browser will manage the cookies for you automatically. 

When using cookie-based sessions, you should set the [`authOptions.sessionSecret` property]({{< relref "auth-options" >}}#sessionsecret) to some secret string which will be used to sign the cookies sent to clients to prevent tampering. This string could be hard-coded in your config file, or (better) reside in an environment variable:

```TypeScript
const config = {
    // ...
    authOptions: {
        tokenMethod: 'cookie',
        sessionSecret: process.env.COOKIE_SESSION_SECRET
    }
}
```

## Bearer-token sessions

In environments when cookies cannot be easily used (e.g. in some server environments), then the bearer-token method can be used.

Using bearer tokens involes a bit more work on your part: you'll need to manually read response headers to get the token, and once you have it you'll have to manually add it to the headers of each request. Here's a simplified example of how that would look:

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
