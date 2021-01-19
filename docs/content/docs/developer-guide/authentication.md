---
title: 'Authentication'
showtoc: true
---

# Authentication

Authentication is the process of determining the identity of a user. Common ways of authenticating a user are by asking the user for secret credentials (username & password) or by a third-party authentication provider such as Facebook or Google login.

By default, Vendure uses a username/email address and password to authenticate users, but also supports a wide range of authentication methods via configurable AuthenticationStrategies.

## Adding support for external authentication

This is done via the [`VendureConfig.authOptions` object]({{< relref "auth-options" >}}#shopauthenticationstrategy):

```TypeScript
export const config: VendureConfig = {
  authOptions: {
      shopAuthenticationStrategy: [
        new NativeAuthenticationStrategy(),
        new FacebookAuthenticationStrategy(),
        new GoogleAuthenticationStrategy(),
      ],
      adminAuthenticationStrategy: [
        new NativeAuthenticationStrategy(),
        new KeycloakAuthenticationStrategy(),
      ],
  }
}
```

In the above example, we define the strategies available for authenticating in the Shop API and the Admin API. The `NativeAuthenticationStrategy` is the only one actually provided by Vendure out-of-the-box, and this is the default username/email + password strategy.

The other strategies would be custom-built (or provided by future npm packages) but creating classes that implement the [`AuthenticationStrategy` interface]({{< relref "authentication-strategy" >}}).

Let's take a look at a couple of examples of what a customer AuthenticationStrategy implementation would look like.

## Example: Google authentication

This example demonstrates how to implement a Google login flow.

### Storefront setup

In your storefront, you need to integrate the Google sign-in button as described in ["Integrating Google Sign-In into your web app"](https://developers.google.com/identity/sign-in/web/sign-in). Successful authentication will result in a `onSignIn` function being called in your app. It will look something like this:

```TypeScript
function onSignIn(googleUser) {
  graphQlQuery(
    `mutation Authenticate($token: String!) {
        authenticate(input: {
          google: { token: $token }
        }) {
        ...on CurrentUser {
            id
            identifier
        }
      }
    }`,
    { token: googleUser.getAuthResponse().id_token }
  ).then(() => {
    // redirect to account page
  });
}
```

### Backend

On the backend, you'll need to define an AuthenticationStrategy to take the authorization token provided by the
storefront in the `authenticate` mutation, and use it to get the necessary personal information on that user from
Google.

To do this you'll need to install the `google-auth-library` npm package as described in the ["Authenticate with a backend server" guide](https://developers.google.com/identity/sign-in/web/backend-auth).

```TypeScript
{
 AuthenticationStrategy,
  ExternalAuthenticationService,
  Injector,
  RequestContext,
  User,
} from '@vendure/core';
import { OAuth2Client } from 'google-auth-library';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export type GoogleAuthData = {
  token: string;
};

export class GoogleAuthenticationStrategy implements AuthenticationStrategy<GoogleAuthData> {
  readonly name = 'google';
  private client: OAuth2Client;
  private externalAuthenticationService: ExternalAuthenticationService;

  constructor(private clientId: string) {
    // The clientId is obtained by creating a new OAuth client ID as described
    // in the Google guide linked above.
    this.client = new OAuth2Client(clientId);
  }

  init(injector: Injector) {
    // The ExternalAuthenticationService is a helper service which encapsulates much
    // of the common functionality related to dealing with external authentication
    // providers.
    this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
  }

  defineInputType(): DocumentNode {
    // Here we define the expected input object expected by the `authenticate` mutation
    // under the "google" key.
    return gql`
        input GoogleAuthInput {
            token: String!
        }
    `;
  }

  async authenticate(ctx: RequestContext, data: GoogleAuthData): Promise<User | false> {
    // Here is the logic that uses the token provided by the storefront and uses it
    // to find the user data from Google.
    const ticket = await this.client.verifyIdToken({
        idToken: data.token,
        audience: this.clientId,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        return false;
    }

    // First we check to see if this user has already authenticated in our
    // Vendure server using this Google account. If so, we return that
    // User object, and they will be now authenticated in Vendure.
    const user = await this.externalAuthenticationService.findCustomerUser(ctx, this.name, payload.sub);
    if (user) {
        return user;
    }

    // If no user was found, we need to create a new User and Customer based
    // on the details provided by Google. The ExternalAuthenticationService
    // provides a convenience method which encapsulates all of this into
    // a single method call.
    return this.externalAuthenticationService.createCustomerAndUser(ctx, {
        strategy: this.name,
        externalIdentifier: payload.sub,
        verified: payload.email_verified || false,
        emailAddress: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
    });
  }
}
```

## Example: Keycloak authentication

Here's an example of an AuthenticationStrategy intended to be used on the Admin API. The use-case is when the company has an existing identity server for employees, and you'd like your Vendure shop admins to be able to authenticate with their existing accounts.

This example uses [Keycloak](https://www.keycloak.org/), a popular open-source identity management server. To get your own Keycloak server up and running in minutes, follow the [Keycloak on Docker](https://www.keycloak.org/getting-started/getting-started-docker) guide.

### Configure a login page & Admin UI

In this example we'll assume the login page is hosted at `http://intranet/login`. We'll also assume that a "login to Vendure" button has been added to that pagem and that the page is using the [Keycloak JavaScript adapter](https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter), which can be used to get the current user's authorization token:

```JavaScript
vendureLoginButton.addEventListener('click', () => {
  return graphQlQuery(`
    mutation Authenticate($token: String!) {
      authenticate(input: {
        keycloak: {
          token: $token
        }
      }) {
        ...on CurrentUser { id }
      }
    }`,
    { token: keycloak.token },
  )
  .then((result) => {
      if (result.data?.authenticate.user) {
          // successfully authenticated - redirect to Vendure Admin UI
          window.location.replace('http://localhost:3000/admin');
      }
  });
});
```

We also need to tell the Admin UI application about the custom login URL, since we have no need for the default "username/password" login form. This can be done by setting the [`loginUrl` property]({{< relref "admin-ui-config" >}}#loginurl) in the AdminUiConfig:

```TypeScript
// vendure-config.ts
plugins: [
  AdminUiPlugin.init({
    port: 5001,
    adminUiConfig: {
      loginUrl: 'http://intranet/login',
    },
  }),
]
```

### Backend

The backend part is very similar to the Google authentication example (they both use the OpenID Connect standard), so we'll not duplicate the explanatory comments here:

```TypeScript
import { HttpService } from '@nestjs/common';
import {
    AuthenticationStrategy,
    ExternalAuthenticationService,
    Injector,
    Logger,
    RequestContext,
    RoleService,
    User,
} from '@vendure/core';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export type KeycloakAuthData = {
    token: string;
};

export class KeycloakAuthenticationStrategy implements AuthenticationStrategy<KeycloakAuthData> {
  readonly name = 'keycloak';
  private externalAuthenticationService: ExternalAuthenticationService;
  private httpService: HttpService;
  private roleService: RoleService;

  init(injector: Injector) {
    this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
    this.httpService = injector.get(HttpService);
    this.roleService = injector.get(RoleService);
  }

  defineInputType(): DocumentNode {
    return gql`
      input KeycloakAuthInput {
        token: String!
      }
    `;
  }

  async authenticate(ctx: RequestContext, data: KeycloakAuthData): Promise<User | false> {
    const { data: userInfo } = await this.httpService
      .get('http://localhost:9000/auth/realms/myrealm/protocol/openid-connect/userinfo', {
          headers: {
              Authorization: `Bearer ${data.token}`,
          },
      }).toPromise();

    if (!userInfo) {
        return false;
    }
    const user = await this.externalAuthenticationService.findAdministratorUser(ctx, this.name, userInfo.sub);
    if (user) {
        return user;
    }

    // When creating an Administrator, we need to know what Role(s) to assign.
    // In this example, we've created a "merchant" role and assign that to all
    // new Administrators. In a real implementation, you can have more complex
    // logic to map an external user to a given role.
    const roles = await this.roleService.findAll();
    const merchantRole = roles.items.find((r) => r.code === 'merchant');
    if (!merchantRole) {
        Logger.error(`Could not find "merchant" role`);
        return false;
    }

    return this.externalAuthenticationService.createAdministratorAndUser(ctx, {
        strategy: this.name,
        externalIdentifier: userInfo.sub,
        identifier: userInfo.preferred_username,
        emailAddress: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        roles: [merchantRole],
    });
  }
}
```
