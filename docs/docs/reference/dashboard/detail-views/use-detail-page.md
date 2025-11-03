---
title: "UseDetailPage"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## useDetailPage

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/use-detail-page.ts" sourceLine="238" packageName="@vendure/dashboard" since="3.3.0" />

**Status: Developer Preview**

This hook is used to create an entity detail page which can read
and update an entity.

*Example*

```ts
const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
    queryDocument: paymentMethodDetailDocument,
    createDocument: createPaymentMethodDocument,
    updateDocument: updatePaymentMethodDocument,
    setValuesForUpdate: entity => {
        return {
            id: entity.id,
            enabled: entity.enabled,
            name: entity.name,
            code: entity.code,
            description: entity.description,
            checker: entity.checker?.code
                ? {
                      code: entity.checker?.code,
                      arguments: entity.checker?.args,
                  }
                : null,
            handler: entity.handler?.code
                ? {
                      code: entity.handler?.code,
                      arguments: entity.handler?.args,
                  }
                : null,
            translations: entity.translations.map(translation => ({
                id: translation.id,
                languageCode: translation.languageCode,
                name: translation.name,
                description: translation.description,
            })),
            customFields: entity.customFields,
        };
    },
    transformCreateInput: input => {
        return {
            ...input,
            checker: input.checker?.code ? input.checker : undefined,
            handler: input.handler,
        };
    },
    params: { id: params.id },
    onSuccess: async data => {
        toast.success(i18n.t('Successfully updated payment method'));
        resetForm();
        if (creatingNewEntity) {
            await navigate({ to: `../$id`, params: { id: data.id } });
        }
    },
    onError: err => {
        toast.error(i18n.t('Failed to update payment method'), {
            description: err instanceof Error ? err.message : 'Unknown error',
        });
    },
});
```

```ts title="Signature"
function useDetailPage<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T> = keyof ResultOf<T>, VarNameUpdate extends keyof VariablesOf<U> = 'input', VarNameCreate extends keyof VariablesOf<C> = 'input'>(options: DetailPageOptions<T, C, U, EntityField, VarNameCreate, VarNameUpdate>): UseDetailPageResult<T, U, EntityField>
```
Parameters

### options

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/detail-views/use-detail-page#detailpageoptions'>DetailPageOptions</a>&#60;T, C, U, EntityField, VarNameCreate, VarNameUpdate&#62;`} />



## DetailPageOptions

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/use-detail-page.ts" sourceLine="46" packageName="@vendure/dashboard" since="3.3.0" />

Options used to configure the result of the `useDetailPage` hook.

```ts title="Signature"
interface DetailPageOptions<T extends TypedDocumentNode<any, any>, C extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T> = DetailEntityPath<T>, VarNameCreate extends keyof VariablesOf<C> = 'input', VarNameUpdate extends keyof VariablesOf<U> = 'input'> {
    pageId?: string;
    queryDocument: T;
    entityField?: EntityField;
    params: {
        id: string;
    };
    entityName?: string;
    createDocument?: C;
    updateDocument?: U;
    setValuesForUpdate: (entity: NonNullable<ResultOf<T>[EntityField]>) => VariablesOf<U>[VarNameUpdate];
    transformCreateInput?: (input: VariablesOf<C>[VarNameCreate]) => VariablesOf<C>[VarNameCreate];
    transformUpdateInput?: (input: VariablesOf<U>[VarNameUpdate]) => VariablesOf<U>[VarNameUpdate];
    onSuccess?: (entity: ResultOf<C>[keyof ResultOf<C>] | ResultOf<U>[keyof ResultOf<U>]) => void;
    onError?: (error: unknown) => void;
}
```

<div className="members-wrapper">

### pageId

<MemberInfo kind="property" type={`string`}   />

The page id. This is optional, but if provided, it will be used to
identify the page when extending the detail page query
### queryDocument

<MemberInfo kind="property" type={`T`}   />

The query document to fetch the entity.
### entityField

<MemberInfo kind="property" type={`EntityField`}   />

The field of the query document that contains the entity.
### params

<MemberInfo kind="property" type={`{         id: string;     }`}   />

The parameters used to identify the entity.
### entityName

<MemberInfo kind="property" type={`string`}   />

The entity type name for custom field configuration lookup.
Required to filter out readonly custom fields before mutations.
If not provided, the function will try to infer it from the query document.
### createDocument

<MemberInfo kind="property" type={`C`}   />

The document to create the entity.
### updateDocument

<MemberInfo kind="property" type={`U`}   />

The document to update the entity.
### setValuesForUpdate

<MemberInfo kind="property" type={`(entity: NonNullable&#60;ResultOf&#60;T&#62;[EntityField]&#62;) =&#62; VariablesOf&#60;U&#62;[VarNameUpdate]`}   />

The function to set the values for the update document.
### transformCreateInput

<MemberInfo kind="property" type={`(input: VariablesOf&#60;C&#62;[VarNameCreate]) =&#62; VariablesOf&#60;C&#62;[VarNameCreate]`}   />


### transformUpdateInput

<MemberInfo kind="property" type={`(input: VariablesOf&#60;U&#62;[VarNameUpdate]) =&#62; VariablesOf&#60;U&#62;[VarNameUpdate]`}   />


### onSuccess

<MemberInfo kind="property" type={`(entity: ResultOf&#60;C&#62;[keyof ResultOf&#60;C&#62;] | ResultOf&#60;U&#62;[keyof ResultOf&#60;U&#62;]) =&#62; void`}   />

The function to call when the update is successful.
### onError

<MemberInfo kind="property" type={`(error: unknown) =&#62; void`}   />

The function to call when the update is successful.


</div>


## UseDetailPageResult

<GenerationInfo sourceFile="packages/dashboard/src/lib/framework/page/use-detail-page.ts" sourceLine="156" packageName="@vendure/dashboard" since="3.3.0" />



```ts title="Signature"
interface UseDetailPageResult<T extends TypedDocumentNode<any, any>, U extends TypedDocumentNode<any, any>, EntityField extends keyof ResultOf<T>> {
    form: UseFormReturn<RemoveNullFields<VariablesOf<U>['input']>>;
    submitHandler: (event: FormEvent<HTMLFormElement>) => void;
    entity?: DetailPageEntity<T, EntityField>;
    isPending: boolean;
    refreshEntity: () => void;
    resetForm: () => void;
}
```

<div className="members-wrapper">

### form

<MemberInfo kind="property" type={`UseFormReturn&#60;RemoveNullFields&#60;VariablesOf&#60;U&#62;['input']&#62;&#62;`}   />


### submitHandler

<MemberInfo kind="property" type={`(event: FormEvent&#60;HTMLFormElement&#62;) =&#62; void`}   />


### entity

<MemberInfo kind="property" type={`DetailPageEntity&#60;T, EntityField&#62;`}   />


### isPending

<MemberInfo kind="property" type={`boolean`}   />


### refreshEntity

<MemberInfo kind="property" type={`() =&#62; void`}   />


### resetForm

<MemberInfo kind="property" type={`() =&#62; void`}   />




</div>
