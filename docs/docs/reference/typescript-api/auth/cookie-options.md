---
title: "CookieOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CookieOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="221" packageName="@vendure/core" />

Options for the handling of the cookies used to track sessions (only applicable if
`authOptions.tokenMethod` is set to `'cookie'`). These options are passed directly
to the Express [cookie-session middleware](https://github.com/expressjs/cookie-session).

```ts title="Signature"
interface CookieOptions {
    name?: string;
    secret?: string;
    path?: string;
    domain?: string;
    sameSite?: 'strict' | 'lax' | 'none' | boolean;
    secure?: boolean;
    secureProxy?: boolean;
    httpOnly?: boolean;
    signed?: boolean;
    overwrite?: boolean;
}
```

<div className="members-wrapper">

### name

<MemberInfo kind="property" type={`string`} default="'session'"   />

The name of the cookie to set.
### secret

<MemberInfo kind="property" type={`string`} default="(random character string)"   />

The secret used for signing the session cookies for authenticated users. Only applies
tokenMethod is set to 'cookie'.

In production applications, this should not be stored as a string in
source control for security reasons, but may be loaded from an external
file not under source control, or from an environment variable, for example.
### path

<MemberInfo kind="property" type={`string`} default="'/'"   />

a string indicating the path of the cookie.
### domain

<MemberInfo kind="property" type={`string`}   />

a string indicating the domain of the cookie (no default).
### sameSite

<MemberInfo kind="property" type={`'strict' | 'lax' | 'none' | boolean`} default="false"   />

a boolean or string indicating whether the cookie is a "same site" cookie (false by default). This can be set to 'strict',
'lax', 'none', or true (which maps to 'strict').
### secure

<MemberInfo kind="property" type={`boolean`}   />

a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
### secureProxy

<MemberInfo kind="property" type={`boolean`}   />

a boolean indicating whether the cookie is only to be sent over HTTPS (use this if you handle SSL not in your node process).
### httpOnly

<MemberInfo kind="property" type={`boolean`} default="true"   />

a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
### signed

<MemberInfo kind="property" type={`boolean`}   />

a boolean indicating whether the cookie is to be signed (true by default). If this is true, another cookie of the same name with the .sig
suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the
first Keygrip key. This signature key is used to detect tampering the next time a cookie is received.
### overwrite

<MemberInfo kind="property" type={`boolean`}   />

a boolean indicating whether to overwrite previously set cookies of the same name (true by default). If this is true, all cookies set during
the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.


</div>
