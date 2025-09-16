---
title: "UseGeneratedForm"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useGeneratedForm

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/use-generated-form.tsx" sourceLine="80" packageName="@vendure/dashboard" since="3.3.0" />

This hook is used to create a form from a document and an entity.
It will create a form with the fields defined in the document's input type.
It will also create a submit handler that will submit the form to the server.

This hook is mostly used internally by the higher-level <a href='/reference/dashboard/detail-views/use-detail-page#usedetailpage'>useDetailPage</a> hook,
but can in some cases be useful to use directly.

*Example*

```tsx
const { form, submitHandler } = useGeneratedForm({
 document: setDraftOrderCustomFieldsDocument,
 varName: undefined,
 entity: entity,
 setValues: entity => {
   return {
     orderId: entity.id,
     input: {
       customFields: entity.customFields,
     },
   };
 },
});
```

```ts title="Signature"
function useGeneratedForm<T extends TypedDocumentNode<any, any>, VarName extends keyof VariablesOf<T> | undefined, E extends Record<string, any> = Record<string, any>>(options: GeneratedFormOptions<T, VarName, E>): void
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/detail-views/use-generated-form#generatedformoptions'>GeneratedFormOptions</a>&#60;T, VarName, E&#62;`} />



## GeneratedFormOptions

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/form-engine/use-generated-form.tsx" sourceLine="20" packageName="@vendure/dashboard" since="3.3.0" />

Options for the useGeneratedForm hook.

```ts title="Signature"
interface GeneratedFormOptions<T extends TypedDocumentNode<any, any>, VarName extends keyof VariablesOf<T> | undefined = 'input', E extends Record<string, any> = Record<string, any>> {
    document?: T;
    varName?: VarName;
    entity: E | null | undefined;
    customFieldConfig?: any[];
    setValues: (
        entity: NonNullable<E>,
    ) => VarName extends keyof VariablesOf<T> ? VariablesOf<T>[VarName] : VariablesOf<T>;
    onSubmit?: (
        values: VarName extends keyof VariablesOf<T> ? VariablesOf<T>[VarName] : VariablesOf<T>,
    ) => void;
}
```

<div className="members-wrapper">

### document

<MemberInfo kind="property" type={`T`}   />

The document to use to generate the form.
### varName

<MemberInfo kind="property" type={`VarName`}   />

The name of the variable to use in the document.
### entity

<MemberInfo kind="property" type={`E | null | undefined`}   />

The entity to use to generate the form.
### customFieldConfig

<MemberInfo kind="property" type={`any[]`}   />


### setValues

<MemberInfo kind="property" type={`(         entity: NonNullable&#60;E&#62;,     ) =&#62; VarName extends keyof VariablesOf&#60;T&#62; ? VariablesOf&#60;T&#62;[VarName] : VariablesOf&#60;T&#62;`}   />


### onSubmit

<MemberInfo kind="property" type={`(         values: VarName extends keyof VariablesOf&#60;T&#62; ? VariablesOf&#60;T&#62;[VarName] : VariablesOf&#60;T&#62;,     ) =&#62; void`}   />




</div>
