---
title: "AuthOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AuthOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="330" packageName="@vendure/core" />

The AuthOptions define how authentication and authorization is managed.

```ts title="Signature"
interface AuthOptions {
    disableAuth?: boolean;
    tokenMethod?: 'cookie' | 'bearer' | ReadonlyArray<'cookie' | 'bearer'>;
    cookieOptions?: CookieOptions;
    authTokenHeaderKey?: string;
    sessionDuration?: string | number;
    sessionCacheStrategy?: SessionCacheStrategy;
    sessionCacheTTL?: number;
    requireVerification?: boolean;
    verificationTokenDuration?: string | number;
    superadminCredentials?: SuperadminCredentials;
    shopAuthenticationStrategy?: AuthenticationStrategy[];
    adminAuthenticationStrategy?: AuthenticationStrategy[];
    customPermissions?: PermissionDefinition[];
    passwordHashingStrategy?: PasswordHashingStrategy;
    passwordValidationStrategy?: PasswordValidationStrategy;
}
```

<div className="members-wrapper">

### disableAuth

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

Disable authentication & permissions checks.
NEVER set the to true in production. It exists
only to aid certain development tasks.
### tokenMethod

<MemberInfo kind="property" type={`'cookie' | 'bearer' | ReadonlyArray&#60;'cookie' | 'bearer'&#62;`} default={`'cookie'`}   />

Sets the method by which the session token is delivered and read.

* 'cookie': Upon login, a 'Set-Cookie' header will be returned to the client, setting a
  cookie containing the session token. A browser-based client (making requests with credentials)
  should automatically send the session cookie with each request.
* 'bearer': Upon login, the token is returned in the response and should be then stored by the
  client app. Each request should include the header `Authorization: Bearer <token>`.

Note that if the bearer method is used, Vendure will automatically expose the configured
`authTokenHeaderKey` in the server's CORS configuration (adding `Access-Control-Expose-Headers: vendure-auth-token`
by default).

From v1.2.0 it is possible to specify both methods as a tuple: `['cookie', 'bearer']`.
### cookieOptions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/cookie-options#cookieoptions'>CookieOptions</a>`}   />

Options related to the handling of cookies when using the 'cookie' tokenMethod.
### authTokenHeaderKey

<MemberInfo kind="property" type={`string`} default={`'vendure-auth-token'`}   />

Sets the header property which will be used to send the auth token when using the 'bearer' method.
### sessionDuration

<MemberInfo kind="property" type={`string | number`} default={`'1y'`}   />

Session duration, i.e. the time which must elapse from the last authenticated request
after which the user must re-authenticate.

Expressed as a string describing a time span per
[zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
### sessionCacheStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/session-cache-strategy#sessioncachestrategy'>SessionCacheStrategy</a>`} default={`<a href='/reference/typescript-api/auth/in-memory-session-cache-strategy#inmemorysessioncachestrategy'>InMemorySessionCacheStrategy</a>`}   />

This strategy defines how sessions will be cached. By default, sessions are cached using a simple
in-memory caching strategy which is suitable for development and low-traffic, single-instance
deployments.
### sessionCacheTTL

<MemberInfo kind="property" type={`number`} default={`300`}   />

The "time to live" of a given item in the session cache. This determines the length of time (in seconds)
that a cache entry is kept before being considered "stale" and being replaced with fresh data
taken from the database.
### requireVerification

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Determines whether new User accounts require verification of their email address.

If set to "true", when registering via the `registerCustomerAccount` mutation, one should *not* set the
`password` property - doing so will result in an error. Instead, the password is set at a later stage
(once the email with the verification token has been opened) via the `verifyCustomerAccount` mutation.
### verificationTokenDuration

<MemberInfo kind="property" type={`string | number`} default={`'7d'`}   />

Sets the length of time that a verification token is valid for, after which the verification token must be refreshed.

Expressed as a string describing a time span per
[zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
### superadminCredentials

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/superadmin-credentials#superadmincredentials'>SuperadminCredentials</a>`}   />

Configures the credentials to be used to create a superadmin
### shopAuthenticationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a>[]`} default={`<a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>`}   />

Configures one or more AuthenticationStrategies which defines how authentication
is handled in the Shop API.
### adminAuthenticationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/authentication-strategy#authenticationstrategy'>AuthenticationStrategy</a>[]`} default={`<a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>`}   />

Configures one or more AuthenticationStrategy which defines how authentication
is handled in the Admin API.
### customPermissions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/permission-definition#permissiondefinition'>PermissionDefinition</a>[]`} default={`[]`}   />

Allows custom Permissions to be defined, which can be used to restrict access to custom
GraphQL resolvers defined in plugins.
### passwordHashingStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/password-hashing-strategy#passwordhashingstrategy'>PasswordHashingStrategy</a>`} default={`<a href='/reference/typescript-api/auth/bcrypt-password-hashing-strategy#bcryptpasswordhashingstrategy'>BcryptPasswordHashingStrategy</a>`}  since="1.3.0"  />

Allows you to customize the way passwords are hashed when using the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.
### passwordValidationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/auth/password-validation-strategy#passwordvalidationstrategy'>PasswordValidationStrategy</a>`} default={`<a href='/reference/typescript-api/auth/default-password-validation-strategy#defaultpasswordvalidationstrategy'>DefaultPasswordValidationStrategy</a>`}  since="1.5.0"  />

Allows you to set a custom policy for passwords when using the <a href='/reference/typescript-api/auth/native-authentication-strategy#nativeauthenticationstrategy'>NativeAuthenticationStrategy</a>.
By default, it uses the <a href='/reference/typescript-api/auth/default-password-validation-strategy#defaultpasswordvalidationstrategy'>DefaultPasswordValidationStrategy</a>, which will impose a minimum length
of four characters. To improve security for production, you are encouraged to specify a more strict
policy, which you can do like this:

*Example*

```ts
{
  passwordValidationStrategy: new DefaultPasswordValidationStrategy({
    // Minimum eight characters, at least one letter and one number
    regexp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  }),
}
```


</div>
