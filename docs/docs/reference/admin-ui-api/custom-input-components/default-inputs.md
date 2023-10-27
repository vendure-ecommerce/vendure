---
title: "Default Inputs"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BooleanFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/boolean-form-input/boolean-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui" />

A checkbox input. The default input component for `boolean` fields.

```ts title="Signature"
class BooleanFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'boolean-form-input';
    readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'boolean-form-input'>;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'boolean-form-input'&#62;`}   />




</div>


## HtmlEditorFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/code-editor-form-input/html-editor-form-input.component.ts" sourceLine="23" packageName="@vendure/admin-ui" />

A JSON editor input with syntax highlighting and error detection. Works well
with `text` type fields.

```ts title="Signature"
class HtmlEditorFormInputComponent extends BaseCodeEditorFormInputComponent implements FormInputComponent, AfterViewInit, OnInit {
    static readonly id: DefaultFormComponentId = 'html-editor-form-input';
    constructor(changeDetector: ChangeDetectorRef)
    ngOnInit() => ;
}
```
* Extends: <code>BaseCodeEditorFormInputComponent</code>


* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>, <code>AfterViewInit</code>, <code>OnInit</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### constructor

<MemberInfo kind="method" type={`(changeDetector: ChangeDetectorRef) => HtmlEditorFormInputComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />




</div>


## JsonEditorFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/code-editor-form-input/json-editor-form-input.component.ts" sourceLine="33" packageName="@vendure/admin-ui" />

A JSON editor input with syntax highlighting and error detection. Works well
with `text` type fields.

```ts title="Signature"
class JsonEditorFormInputComponent extends BaseCodeEditorFormInputComponent implements FormInputComponent, AfterViewInit, OnInit {
    static readonly id: DefaultFormComponentId = 'json-editor-form-input';
    constructor(changeDetector: ChangeDetectorRef)
    ngOnInit() => ;
}
```
* Extends: <code>BaseCodeEditorFormInputComponent</code>


* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>, <code>AfterViewInit</code>, <code>OnInit</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### constructor

<MemberInfo kind="method" type={`(changeDetector: ChangeDetectorRef) => JsonEditorFormInputComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />




</div>


## CombinationModeFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/combination-mode-form-input/combination-mode-form-input.component.ts" sourceLine="17" packageName="@vendure/admin-ui" />

A special input used to display the "Combination mode" AND/OR toggle.

```ts title="Signature"
class CombinationModeFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'combination-mode-form-input';
    readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'combination-mode-form-input'>;
    selectable$: Observable<boolean>;
    constructor(configurableInputComponent: ConfigurableInputComponent)
    ngOnInit() => ;
    setCombinationModeAnd() => ;
    setCombinationModeOr() => ;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>, <code>OnInit</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'combination-mode-form-input'&#62;`}   />


### selectable$

<MemberInfo kind="property" type={`Observable&#60;boolean&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(configurableInputComponent: ConfigurableInputComponent) => CombinationModeFormInputComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### setCombinationModeAnd

<MemberInfo kind="method" type={`() => `}   />


### setCombinationModeOr

<MemberInfo kind="method" type={`() => `}   />




</div>


## CurrencyFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/currency-form-input/currency-form-input.component.ts" sourceLine="17" packageName="@vendure/admin-ui" />

An input for monetary values. Should be used with `int` type fields.

```ts title="Signature"
class CurrencyFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'currency-form-input';
    @Input() readonly: boolean;
    formControl: UntypedFormControl;
    currencyCode$: Observable<CurrencyCode>;
    config: DefaultFormComponentConfig<'currency-form-input'>;
    constructor(dataService: DataService)
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### currencyCode$

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>&#62;`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'currency-form-input'&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>) => CurrencyFormInputComponent`}   />




</div>


## CustomerGroupFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/customer-group-form-input/customer-group-form-input.component.ts" sourceLine="20" packageName="@vendure/admin-ui" />

Allows the selection of a Customer via an autocomplete select input.
Should be used with `ID` type fields which represent Customer IDs.

```ts title="Signature"
class CustomerGroupFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'customer-group-form-input';
    @Input() readonly: boolean;
    formControl: FormControl<string | { id: string }>;
    customerGroups$: Observable<GetCustomerGroupsQuery['customerGroups']['items']>;
    config: DefaultFormComponentConfig<'customer-group-form-input'>;
    constructor(dataService: DataService)
    ngOnInit() => ;
    selectGroup(group: ItemOf<GetCustomerGroupsQuery, 'customerGroups'>) => ;
    compareWith(o1: T, o2: T) => ;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>, <code>OnInit</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`FormControl&#60;string | { id: string }&#62;`}   />


### customerGroups$

<MemberInfo kind="property" type={`Observable&#60;GetCustomerGroupsQuery['customerGroups']['items']&#62;`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'customer-group-form-input'&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>) => CustomerGroupFormInputComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### selectGroup

<MemberInfo kind="method" type={`(group: ItemOf&#60;GetCustomerGroupsQuery, 'customerGroups'&#62;) => `}   />


### compareWith

<MemberInfo kind="method" type={`(o1: T, o2: T) => `}   />




</div>


## DateFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/date-form-input/date-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui" />

Allows selection of a datetime. Default input for `datetime` type fields.

```ts title="Signature"
class DateFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'date-form-input';
    @Input() readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'date-form-input'>;
    min: void
    max: void
    yearRange: void
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'date-form-input'&#62;`}   />


### min

<MemberInfo kind="property" type={``}   />


### max

<MemberInfo kind="property" type={``}   />


### yearRange

<MemberInfo kind="property" type={``}   />




</div>


## FacetValueFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/facet-value-form-input/facet-value-form-input.component.ts" sourceLine="16" packageName="@vendure/admin-ui" />

Allows the selection of multiple FacetValues via an autocomplete select input.
Should be used with `ID` type **list** fields which represent FacetValue IDs.

```ts title="Signature"
class FacetValueFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'facet-value-form-input';
    readonly isListInput = true;
    readonly: boolean;
    formControl: UntypedFormControl;
    config: InputComponentConfig;
    valueTransformFn = (values: FacetValueFragment[]) => {
        const isUsedInConfigArg = this.config.__typename === 'ConfigArgDefinition';
        if (isUsedInConfigArg) {
            return JSON.stringify(values.map(s => s.id));
        } else {
            return values;
        }
    };
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### isListInput

<MemberInfo kind="property" type={``}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`InputComponentConfig`}   />


### valueTransformFn

<MemberInfo kind="property" type={``}   />




</div>


## NumberFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/number-form-input/number-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui" />

Displays a number input. Default input for `int` and `float` type fields.

```ts title="Signature"
class NumberFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'number-form-input';
    @Input() readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'number-form-input'>;
    prefix: void
    suffix: void
    min: void
    max: void
    step: void
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'number-form-input'&#62;`}   />


### prefix

<MemberInfo kind="property" type={``}   />


### suffix

<MemberInfo kind="property" type={``}   />


### min

<MemberInfo kind="property" type={``}   />


### max

<MemberInfo kind="property" type={``}   />


### step

<MemberInfo kind="property" type={``}   />




</div>


## PasswordFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/password-form-input/password-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui" />

Displays a password text input. Should be used with `string` type fields.

```ts title="Signature"
class PasswordFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'password-form-input';
    readonly: boolean;
    formControl: UntypedFormControl;
    config: InputComponentConfig;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`InputComponentConfig`}   />




</div>


## ProductSelectorFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/product-selector-form-input/product-selector-form-input.component.ts" sourceLine="20" packageName="@vendure/admin-ui" />

Allows the selection of multiple ProductVariants via an autocomplete select input.
Should be used with `ID` type **list** fields which represent ProductVariant IDs.

```ts title="Signature"
class ProductSelectorFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'product-selector-form-input';
    readonly isListInput = true;
    readonly: boolean;
    formControl: FormControl<Array<string | { id: string }>>;
    config: DefaultFormComponentUiConfig<'product-selector-form-input'>;
    selection$: Observable<Array<GetProductVariantQuery['productVariant']>>;
    constructor(dataService: DataService)
    ngOnInit() => ;
    addProductVariant(product: ProductSelectorSearchQuery['search']['items'][number]) => ;
    removeProductVariant(id: string) => ;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>, <code>OnInit</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### isListInput

<MemberInfo kind="property" type={``}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`FormControl&#60;Array&#60;string | { id: string }&#62;&#62;`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentUiConfig&#60;'product-selector-form-input'&#62;`}   />


### selection$

<MemberInfo kind="property" type={`Observable&#60;Array&#60;GetProductVariantQuery['productVariant']&#62;&#62;`}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>) => ProductSelectorFormInputComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### addProductVariant

<MemberInfo kind="method" type={`(product: ProductSelectorSearchQuery['search']['items'][number]) => `}   />


### removeProductVariant

<MemberInfo kind="method" type={`(id: string) => `}   />




</div>


## RelationFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/relation-form-input/relation-form-input.component.ts" sourceLine="17" packageName="@vendure/admin-ui" />

The default input component for `relation` type custom fields. Allows the selection
of a ProductVariant, Product, Customer or Asset. For other entity types, a custom
implementation will need to be defined. See <a href='/reference/admin-ui-api/custom-input-components/register-form-input-component#registerforminputcomponent'>registerFormInputComponent</a>.

```ts title="Signature"
class RelationFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'relation-form-input';
    @Input() readonly: boolean;
    formControl: UntypedFormControl;
    config: RelationCustomFieldConfig;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`RelationCustomFieldConfig`}   />




</div>


## RichTextFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/rich-text-form-input/rich-text-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui" />

Uses the <a href='/reference/admin-ui-api/components/rich-text-editor-component#richtexteditorcomponent'>RichTextEditorComponent</a> as in input for `text` type fields.

```ts title="Signature"
class RichTextFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'rich-text-form-input';
    readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'rich-text-form-input'>;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'rich-text-form-input'&#62;`}   />




</div>


## SelectFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/select-form-input/select-form-input.component.ts" sourceLine="18" packageName="@vendure/admin-ui" />

Uses a select input to allow the selection of a string value. Should be used with
`string` type fields with options.

```ts title="Signature"
class SelectFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'select-form-input';
    @Input() readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'select-form-input'> & CustomFieldConfigFragment;
    uiLanguage$: Observable<LanguageCode>;
    options: void
    constructor(dataService: DataService)
    ngOnInit() => ;
    trackByFn(index: number, item: any) => ;
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>, <code>OnInit</code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'select-form-input'&#62; &#38; CustomFieldConfigFragment`}   />


### uiLanguage$

<MemberInfo kind="property" type={`Observable&#60;<a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;`}   />


### options

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(dataService: <a href='/reference/admin-ui-api/services/data-service#dataservice'>DataService</a>) => SelectFormInputComponent`}   />


### ngOnInit

<MemberInfo kind="method" type={`() => `}   />


### trackByFn

<MemberInfo kind="method" type={`(index: number, item: any) => `}   />




</div>


## TextFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/text-form-input/text-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui" />

Uses a regular text form input. This is the default input for `string` and `localeString` type fields.

```ts title="Signature"
class TextFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'text-form-input';
    readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'text-form-input'>;
    prefix: void
    suffix: void
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'text-form-input'&#62;`}   />


### prefix

<MemberInfo kind="property" type={``}   />


### suffix

<MemberInfo kind="property" type={``}   />




</div>


## TextareaFormInputComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/textarea-form-input/textarea-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui" />

Uses textarea form input. This is the default input for `text` type fields.

```ts title="Signature"
class TextareaFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'textarea-form-input';
    readonly: boolean;
    formControl: UntypedFormControl;
    config: DefaultFormComponentConfig<'textarea-form-input'>;
    spellcheck: boolean
}
```
* Implements: <code><a href='/reference/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a></code>



<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>`}   />


### readonly

<MemberInfo kind="property" type={`boolean`}   />


### formControl

<MemberInfo kind="property" type={`UntypedFormControl`}   />


### config

<MemberInfo kind="property" type={`DefaultFormComponentConfig&#60;'textarea-form-input'&#62;`}   />


### spellcheck

<MemberInfo kind="property" type={`boolean`}   />




</div>
