---
title: "Middleware"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Middleware

<GenerationInfo sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="209" packageName="@vendure/core" />

Defines API middleware, set in the <a href='/reference/typescript-api/configuration/api-options#apioptions'>ApiOptions</a>. Middleware can be either
[Express middleware](https://expressjs.com/en/guide/using-middleware.html) or [NestJS middleware](https://docs.nestjs.com/middleware).

## Increasing the maximum request body size limit

Internally, Vendure relies on the body-parser middleware to parse incoming JSON data. By default, the maximum
body size is set to 100kb. Attempting to send a request with more than 100kb of JSON data will result in a
`PayloadTooLargeError`. To increase this limit, we can manually configure the body-parser middleware:

*Example*

```ts
import { VendureConfig } from '@vendure/core';
import { json } from 'body-parser';

export const config: VendureConfig = {
  // ...
  apiOptions: {
    middleware: [{
      handler: json({ limit: '10mb' }),
      route: '*',
      beforeListen: true,
    }],
  },
};
```

```ts title="Signature"
interface Middleware {
    handler: MiddlewareHandler;
    route: string;
    beforeListen?: boolean;
}
```

<div className="members-wrapper">

### handler

<MemberInfo kind="property" type={`MiddlewareHandler`}   />

The Express middleware function or NestJS `NestMiddleware` class.
### route

<MemberInfo kind="property" type={`string`}   />

The route to which this middleware will apply. Pattern based routes are supported as well.

The `'ab*cd'` route path will match `abcd`, `ab_cd`, `abecd`, and so on. The characters `?`, `+`, `*`, and `()` may be used in a route path,
and are subsets of their regular expression counterparts. The hyphen (`-`) and the dot (`.`) are interpreted literally.
### beforeListen

<MemberInfo kind="property" type={`boolean`} default="false"  since="1.1.0"  />

When set to `true`, this will cause the middleware to be applied before the Vendure server (and underlying Express server) starts listening
for connections. In practical terms this means that the middleware will be at the very start of the middleware stack, before even the
`body-parser` middleware which is automatically applied by NestJS. This can be useful in certain cases such as when you need to access the
raw unparsed request for a specific route.


</div>
