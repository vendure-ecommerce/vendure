---
title: "CookieOptions"
weight: 10
date: 2023-07-14T16:57:49.727Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CookieOptions
<div class="symbol">


# CookieOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="220" packageName="@vendure/core">}}

Options for the handling of the cookies used to track sessions (only applicable if
`authOptions.tokenMethod` is set to `'cookie'`). These options are passed directly
to the Express [cookie-session middleware](https://github.com/expressjs/cookie-session).

## Signature

```TypeScript
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
## Members

### name

{{< member-info kind="property" type="string" default="'session'"  >}}

{{< member-description >}}The name of the cookie to set.{{< /member-description >}}

### secret

{{< member-info kind="property" type="string" default="(random character string)"  >}}

{{< member-description >}}The secret used for signing the session cookies for authenticated users. Only applies
tokenMethod is set to 'cookie'.

In production applications, this should not be stored as a string in
source control for security reasons, but may be loaded from an external
file not under source control, or from an environment variable, for example.{{< /member-description >}}

### path

{{< member-info kind="property" type="string" default="'/'"  >}}

{{< member-description >}}a string indicating the path of the cookie.{{< /member-description >}}

### domain

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}a string indicating the domain of the cookie (no default).{{< /member-description >}}

### sameSite

{{< member-info kind="property" type="'strict' | 'lax' | 'none' | boolean" default="false"  >}}

{{< member-description >}}a boolean or string indicating whether the cookie is a "same site" cookie (false by default). This can be set to 'strict',
'lax', 'none', or true (which maps to 'strict').{{< /member-description >}}

### secure

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).{{< /member-description >}}

### secureProxy

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}a boolean indicating whether the cookie is only to be sent over HTTPS (use this if you handle SSL not in your node process).{{< /member-description >}}

### httpOnly

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).{{< /member-description >}}

### signed

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}a boolean indicating whether the cookie is to be signed (true by default). If this is true, another cookie of the same name with the .sig
suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the
first Keygrip key. This signature key is used to detect tampering the next time a cookie is received.{{< /member-description >}}

### overwrite

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}a boolean indicating whether to overwrite previously set cookies of the same name (true by default). If this is true, all cookies set during
the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.{{< /member-description >}}


</div>
