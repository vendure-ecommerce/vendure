---
title: "EmailGenerator"
weight: 10
date: 2023-07-14T16:57:50.714Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EmailGenerator
<div class="symbol">


# EmailGenerator

{{< generation-info sourceFile="packages/email-plugin/src/email-generator.ts" sourceLine="13" packageName="@vendure/email-plugin">}}

An EmailGenerator generates the subject and body details of an email.

## Signature

```TypeScript
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
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### onInit

{{< member-info kind="method" type="(options: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-options#emailpluginoptions'>EmailPluginOptions</a>) => void | Promise&#60;void&#62;"  >}}

{{< member-description >}}Any necessary setup can be performed here.{{< /member-description >}}

### generate

{{< member-info kind="method" type="(from: string, subject: string, body: string, templateVars: { [key: string]: any }) => Pick&#60;<a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>, 'from' | 'subject' | 'body'&#62;"  >}}

{{< member-description >}}Given a subject and body from an email template, this method generates the final
interpolated email text.{{< /member-description >}}


</div>
<div class="symbol">


# HandlebarsMjmlGenerator

{{< generation-info sourceFile="packages/email-plugin/src/handlebars-mjml-generator.ts" sourceLine="23" packageName="@vendure/email-plugin">}}

Uses Handlebars (https://handlebarsjs.com/) to output MJML (https://mjml.io) which is then
compiled down to responsive email HTML.

## Signature

```TypeScript
class HandlebarsMjmlGenerator implements EmailGenerator {
  async onInit(options: InitializedEmailPluginOptions) => ;
  generate(from: string, subject: string, template: string, templateVars: any) => ;
}
```
## Implements

 * <a href='/typescript-api/core-plugins/email-plugin/email-generator#emailgenerator'>EmailGenerator</a>


## Members

### onInit

{{< member-info kind="method" type="(options: InitializedEmailPluginOptions) => "  >}}

{{< member-description >}}{{< /member-description >}}

### generate

{{< member-info kind="method" type="(from: string, subject: string, template: string, templateVars: any) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
