---
title: "EmailGenerator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EmailGenerator

<GenerationInfo sourceFile="packages/email-plugin/src/generator/email-generator.ts" sourceLine="13" packageName="@vendure/email-plugin" />

An EmailGenerator generates the subject and body details of an email.

```ts title="Signature"
interface EmailGenerator<T extends string = any, E extends VendureEvent = any> extends InjectableStrategy {
    onInit?(options: EmailPluginOptions): void | Promise<void>;
    generate(
        from: string,
        subject: string,
        body: string,
        templateVars: { [key: string]: any },
    ): Pick<EmailDetails, 'from' | 'subject' | 'body'>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### onInit

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/email-plugin/email-plugin-options#emailpluginoptions'>EmailPluginOptions</a>) => void | Promise&#60;void&#62;`}   />

Any necessary setup can be performed here.
### generate

<MemberInfo kind="method" type={`(from: string, subject: string, body: string, templateVars: { [key: string]: any }) => Pick&#60;<a href='/reference/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>, 'from' | 'subject' | 'body'&#62;`}   />

Given a subject and body from an email template, this method generates the final
interpolated email text.


</div>


## HandlebarsMjmlGenerator

<GenerationInfo sourceFile="packages/email-plugin/src/generator/handlebars-mjml-generator.ts" sourceLine="17" packageName="@vendure/email-plugin" />

Uses Handlebars (https://handlebarsjs.com/) to output MJML (https://mjml.io) which is then
compiled down to responsive email HTML.

```ts title="Signature"
class HandlebarsMjmlGenerator implements EmailGenerator {
    onInit(options: InitializedEmailPluginOptions) => ;
    generate(from: string, subject: string, template: string, templateVars: any) => ;
}
```
* Implements: <code><a href='/reference/core-plugins/email-plugin/email-generator#emailgenerator'>EmailGenerator</a></code>



<div className="members-wrapper">

### onInit

<MemberInfo kind="method" type={`(options: InitializedEmailPluginOptions) => `}   />


### generate

<MemberInfo kind="method" type={`(from: string, subject: string, template: string, templateVars: any) => `}   />




</div>
