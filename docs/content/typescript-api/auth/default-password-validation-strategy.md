---
title: "DefaultPasswordValidationStrategy"
weight: 10
date: 2023-07-14T16:57:49.479Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultPasswordValidationStrategy
<div class="symbol">


# DefaultPasswordValidationStrategy

{{< generation-info sourceFile="packages/core/src/config/auth/default-password-validation-strategy.ts" sourceLine="18" packageName="@vendure/core" since="1.5.0">}}

The DefaultPasswordValidationStrategy allows you to specify a minimum length and/or
a regular expression to match passwords against.

TODO:
By default, the `minLength` will be set to `4`. This is rather permissive and is only
this way in order to reduce the risk of backward-compatibility breaks. In the next major version
this default will be made more strict.

## Signature

```TypeScript
class DefaultPasswordValidationStrategy implements PasswordValidationStrategy {
  constructor(options: { minLength?: number; regexp?: RegExp })
  validate(ctx: RequestContext, password: string) => boolean | string;
}
```
## Implements

 * <a href='/typescript-api/auth/password-validation-strategy#passwordvalidationstrategy'>PasswordValidationStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(options: { minLength?: number; regexp?: RegExp }) => DefaultPasswordValidationStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### validate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, password: string) => boolean | string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
