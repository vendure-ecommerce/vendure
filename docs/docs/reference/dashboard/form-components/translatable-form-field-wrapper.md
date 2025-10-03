---
title: "TranslatableFormFieldWrapper"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TranslatableFormFieldWrapper

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/translatable-form-field.tsx" sourceLine="112" packageName="@vendure/dashboard" since="3.4.0" />

This is the equivalent of the <a href='/reference/dashboard/form-components/form-field-wrapper#formfieldwrapper'>FormFieldWrapper</a> component, but for translatable fields.

*Example*

```tsx
<PageBlock column="main" blockId="main-form">
    <DetailFormGrid>
        <TranslatableFormFieldWrapper
            control={form.control}
            name="name"
            label={<Trans>Product name</Trans>}
            render={({ field }) => <Input {...field} />}
        />
        <TranslatableFormFieldWrapper
            control={form.control}
            name="slug"
            label={<Trans>Slug</Trans>}
            render={({ field }) => <Input {...field} />}
        />
    </DetailFormGrid>

    <TranslatableFormFieldWrapper
        control={form.control}
        name="description"
        label={<Trans>Description</Trans>}
        render={({ field }) => <RichTextInput {...field} />}
    />
</PageBlock>
```



## TranslatableFormFieldProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/translatable-form-field.tsx" sourceLine="22" packageName="@vendure/dashboard" since="3.4.0" />

The props for the TranslatableFormField component.

```ts title="Signature"
type TranslatableFormFieldProps<TFieldValues extends TranslatableEntity | TranslatableEntity[]> = Omit<
    ControllerProps<TFieldValues>,
    'name'
> & {
    /**
     * @description
     * The label for the form field.
     */
    label?: React.ReactNode;
    /**
     * @description
     * The name of the form field.
     */
    name: TFieldValues extends TranslatableEntity
        ? keyof Omit<NonNullable<TFieldValues['translations']>[number], 'languageCode'>
        : TFieldValues extends TranslatableEntity[]
          ? keyof Omit<NonNullable<TFieldValues[number]['translations']>[number], 'languageCode'>
          : never;
}
```
