---
title: "FormFieldWrapper"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FormFieldWrapper

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/form-field-wrapper.tsx" sourceLine="74" packageName="@vendure/dashboard" since="3.4.0" />

This is a wrapper that can be used in all forms to wrap the actual form control, and provide a label, description and error message.

Use this instead of the default Shadcn FormField (etc.) components, as it also supports
overridden form components.

*Example*

```tsx
<PageBlock column="main" blockId="main-form">
    <DetailFormGrid>
        <FormFieldWrapper
            control={form.control}
            name="description"
            label={<Trans>Description</Trans>}
            render={({ field }) => <Input {...field} />}
        />
        <FormFieldWrapper
            control={form.control}
            name="code"
            label={<Trans>Code</Trans>}
            render={({ field }) => <Input {...field} />}
        />
    </DetailFormGrid>
</PageBlock>
```

If you are dealing with translatable fields, use the <a href='/reference/dashboard/form-components/translatable-form-field-wrapper#translatableformfieldwrapper'>TranslatableFormFieldWrapper</a> component instead.

```ts title="Signature"
function FormFieldWrapper<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: FormFieldWrapperProps<TFieldValues, TName>): void
```
Parameters

### props

<MemberInfo kind="parameter" type={`<a href='/reference/dashboard/form-components/form-field-wrapper#formfieldwrapperprops'>FormFieldWrapperProps</a>&#60;TFieldValues, TName&#62;`} />



## FormFieldWrapperProps

<GenerationInfo sourceFile="packages/dashboard/src/lib/components/shared/form-field-wrapper.tsx" sourceLine="14" packageName="@vendure/dashboard" since="3.4.0" />

The props for the FormFieldWrapper component.

```ts title="Signature"
type FormFieldWrapperProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = React.ComponentProps<typeof FormField<TFieldValues, TName>> & {
    /**
     * @description
     * The label for the form field.
     */
    label?: React.ReactNode;
    /**
     * @description
     * The description for the form field.
     */
    description?: React.ReactNode;
    /**
     * @description
     * Whether to render the form control.
     * If false, the form control will not be rendered.
     * This is useful when you want to render the form control in a custom way, e.g. for <Select/> components,
     * where the FormControl needs to nested in the root component.
     *
     * @default true
     */
    renderFormControl?: boolean;
}
```
