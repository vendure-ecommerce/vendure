---
title: "AuthOptions"
weight: 10
generated: true
---
<!-- This file was generated from the Vendure TypeScript source. Do not modify. Instead, re-run "generate-docs" -->


# AuthOptions

The AuthOptions define how authentication is managed.

### disableAuth

{{< member-info type="boolean" default="true" >}}

Disable authentication & permissions checks.NEVER set the to true in production. It existsonly to aid certain development tasks.

### tokenMethod

{{< member-info type="'cookie' | 'bearer'" default="'cookie'" >}}

Sets the method by which the session token is delivered and read.* 'cookie': Upon login, a 'Set-Cookie' header will be returned to the client, setting acookie containing the session token. A browser-based client (making requests with credentials)should automatically send the session cookie with each request.* 'bearer': Upon login, the token is returned in the response and should be then stored by theclient app. Each request should include the header 'Authorization: Bearer <token>'.

### sessionSecret

{{< member-info type="string" default="'session-secret'" >}}

The secret used for signing the session cookies for authenticated users. Only applies whentokenMethod is set to 'cookie'.In production applications, this should not be stored as a string insource control for security reasons, but may be loaded from an externalfile not under source control, or from an environment variable, for example.

### authTokenHeaderKey

{{< member-info type="string" default="'vendure-auth-token'" >}}

Sets the header property which will be used to send the auth token when using the 'bearer' method.

### sessionDuration

{{< member-info type="string | number" default="'7d'" >}}

Session duration, i.e. the time which must elapse from the last authenticted requestafter which the user must re-authenticate.Expressed as a string describing a time span per[zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`

### requireVerification

{{< member-info type="boolean" >}}

Determines whether new User accounts require verification of their email address.

### verificationTokenDuration

{{< member-info type="string | number" default="'7d'" >}}

Sets the length of time that a verification token is valid for, after which the verification token must be refreshed.Expressed as a string describing a time span per[zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`

