---
title: "Custom Template Loader"
weight: 10
date: 2023-07-20T13:56:16.967Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TemplateLoader

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="390" packageName="@vendure/email-plugin" />

Load an email template based on the given request context, type and template name
and return the template as a string.

*Example*

```TypeScript
import { EmailPlugin, TemplateLoader } from '@vendure/email-plugin';

class MyTemplateLoader implements TemplateLoader {
     loadTemplate(injector, ctx, { type, templateName }){
         return myCustomTemplateFunction(ctx);
     }
}

// In vendure-config.ts:
...
EmailPlugin.init({
    templateLoader: new MyTemplateLoader()
    ...
})
```

```ts title="Signature"
interface TemplateLoader {
  loadTemplate(injector: Injector, ctx: RequestContext, input: LoadTemplateInput): Promise<string>;
  loadPartials?(): Promise<Partial[]>;
}
```

### loadTemplate

<MemberInfo kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: LoadTemplateInput) => Promise&#60;string&#62;"   />


### loadPartials

<MemberInfo kind="method" type="() => Promise&#60;Partial[]&#62;"   />


