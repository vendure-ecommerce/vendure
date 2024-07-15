---
title: "TemplateLoader"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TemplateLoader

<GenerationInfo sourceFile="packages/email-plugin/src/template-loader/template-loader.ts" sourceLine="32" packageName="@vendure/email-plugin" />

Loads email templates based on the given request context, type and template name
and return the template as a string.

*Example*

```ts
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

<div className="members-wrapper">

### loadTemplate

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: LoadTemplateInput) => Promise&#60;string&#62;`}   />

Load template and return it's content as a string
### loadPartials

<MemberInfo kind="method" type={`() => Promise&#60;Partial[]&#62;`}   />

Load partials and return their contents.
This method is only called during initialization, i.e. during server startup.


</div>


## FileBasedTemplateLoader

<GenerationInfo sourceFile="packages/email-plugin/src/template-loader/file-based-template-loader.ts" sourceLine="17" packageName="@vendure/email-plugin" />

Loads email templates from the local file system. This is the default
loader used by the EmailPlugin.

```ts title="Signature"
class FileBasedTemplateLoader implements TemplateLoader {
    constructor(templatePath: string)
    loadTemplate(_injector: Injector, _ctx: RequestContext, { type, templateName }: LoadTemplateInput) => Promise<string>;
    loadPartials() => Promise<Partial[]>;
}
```
* Implements: <code><a href='/reference/core-plugins/email-plugin/template-loader#templateloader'>TemplateLoader</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(templatePath: string) => FileBasedTemplateLoader`}   />


### loadTemplate

<MemberInfo kind="method" type={`(_injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>, _ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { type, templateName }: LoadTemplateInput) => Promise&#60;string&#62;`}   />


### loadPartials

<MemberInfo kind="method" type={`() => Promise&#60;Partial[]&#62;`}   />




</div>
