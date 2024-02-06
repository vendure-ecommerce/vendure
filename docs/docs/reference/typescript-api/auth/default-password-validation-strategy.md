---
title: "DefaultPasswordValidationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultPasswordValidationStrategy

<GenerationInfo sourceFile="packages/core/src/config/auth/default-password-validation-strategy.ts" sourceLine="18" packageName="@vendure/core" since="1.5.0" />

The DefaultPasswordValidationStrategy allows you to specify a minimum length and/or
a regular expression to match passwords against.

TODO:
By default, the `minLength` will be set to `4`. This is rather permissive and is only
this way in order to reduce the risk of backward-compatibility breaks. In the next major version
this default will be made more strict.

```ts title="Signature"
class DefaultPasswordValidationStrategy implements PasswordValidationStrategy {
    constructor(options: { minLength?: number; regexp?: RegExp })
    validate(ctx: RequestContext, password: string) => boolean | string;
}
```
* Implements: <code><a href='/reference/typescript-api/auth/password-validation-strategy#passwordvalidationstrategy'>PasswordValidationStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(options: { minLength?: number; regexp?: RegExp }) => DefaultPasswordValidationStrategy`}   />


### validate

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, password: string) => boolean | string`}   />




</div>
