---
title: "Default Inputs"
weight: 10
date: 2023-07-14T16:57:51.266Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# default-inputs
<div class="symbol">


# BooleanFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/boolean-form-input/boolean-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

A checkbox input. The default input component for `boolean` fields.

## Signature

```TypeScript
class BooleanFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'boolean-form-input';
  readonly: boolean;
  formControl: UntypedFormControl;
  config: DefaultFormComponentConfig<'boolean-form-input'>;
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'boolean-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# HtmlEditorFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/code-editor-form-input/html-editor-form-input.component.ts" sourceLine="23" packageName="@vendure/admin-ui">}}

A JSON editor input with syntax highlighting and error detection. Works well
with `text` type fields.

## Signature

```TypeScript
class HtmlEditorFormInputComponent extends BaseCodeEditorFormInputComponent implements FormInputComponent, AfterViewInit, OnInit {
  static readonly static readonly id: DefaultFormComponentId = 'html-editor-form-input';
  constructor(changeDetector: ChangeDetectorRef)
  ngOnInit() => ;
}
```
## Extends

 * BaseCodeEditorFormInputComponent


## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>
 * AfterViewInit
 * OnInit


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(changeDetector: ChangeDetectorRef) => HtmlEditorFormInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# JsonEditorFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/code-editor-form-input/json-editor-form-input.component.ts" sourceLine="33" packageName="@vendure/admin-ui">}}

A JSON editor input with syntax highlighting and error detection. Works well
with `text` type fields.

## Signature

```TypeScript
class JsonEditorFormInputComponent extends BaseCodeEditorFormInputComponent implements FormInputComponent, AfterViewInit, OnInit {
  static readonly static readonly id: DefaultFormComponentId = 'json-editor-form-input';
  constructor(changeDetector: ChangeDetectorRef)
  ngOnInit() => ;
}
```
## Extends

 * BaseCodeEditorFormInputComponent


## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>
 * AfterViewInit
 * OnInit


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(changeDetector: ChangeDetectorRef) => JsonEditorFormInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CombinationModeFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/combination-mode-form-input/combination-mode-form-input.component.ts" sourceLine="17" packageName="@vendure/admin-ui">}}

A special input used to display the "Combination mode" AND/OR toggle.

## Signature

```TypeScript
class CombinationModeFormInputComponent implements FormInputComponent, OnInit {
  static readonly static readonly id: DefaultFormComponentId = 'combination-mode-form-input';
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
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>
 * OnInit


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'combination-mode-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### selectable$

{{< member-info kind="property" type="Observable&#60;boolean&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(configurableInputComponent: ConfigurableInputComponent) => CombinationModeFormInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### setCombinationModeAnd

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### setCombinationModeOr

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CurrencyFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/currency-form-input/currency-form-input.component.ts" sourceLine="17" packageName="@vendure/admin-ui">}}

An input for monetary values. Should be used with `int` type fields.

## Signature

```TypeScript
class CurrencyFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'currency-form-input';
  @Input() @Input() readonly: boolean;
  formControl: UntypedFormControl;
  currencyCode$: Observable<CurrencyCode>;
  config: DefaultFormComponentConfig<'currency-form-input'>;
  constructor(dataService: DataService)
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### currencyCode$

{{< member-info kind="property" type="Observable&#60;<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'currency-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => CurrencyFormInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CustomerGroupFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/customer-group-form-input/customer-group-form-input.component.ts" sourceLine="20" packageName="@vendure/admin-ui">}}

Allows the selection of a Customer via an autocomplete select input.
Should be used with `ID` type fields which represent Customer IDs.

## Signature

```TypeScript
class CustomerGroupFormInputComponent implements FormInputComponent, OnInit {
  static readonly static readonly id: DefaultFormComponentId = 'customer-group-form-input';
  @Input() @Input() readonly: boolean;
  formControl: FormControl<string | { id: string }>;
  customerGroups$: Observable<GetCustomerGroupsQuery['customerGroups']['items']>;
  config: DefaultFormComponentConfig<'customer-group-form-input'>;
  constructor(dataService: DataService)
  ngOnInit() => ;
  selectGroup(group: ItemOf<GetCustomerGroupsQuery, 'customerGroups'>) => ;
  compareWith(o1: ItemOf<GetCustomerGroupsQuery, 'customerGroups'>, o2: ItemOf<GetCustomerGroupsQuery, 'customerGroups'>) => ;
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>
 * OnInit


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="FormControl&#60;string | { id: string }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### customerGroups$

{{< member-info kind="property" type="Observable&#60;GetCustomerGroupsQuery['customerGroups']['items']&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'customer-group-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => CustomerGroupFormInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### selectGroup

{{< member-info kind="method" type="(group: ItemOf&#60;GetCustomerGroupsQuery, 'customerGroups'&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}

### compareWith

{{< member-info kind="method" type="(o1: ItemOf&#60;GetCustomerGroupsQuery, 'customerGroups'&#62;, o2: ItemOf&#60;GetCustomerGroupsQuery, 'customerGroups'&#62;) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# DateFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/date-form-input/date-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

Allows selection of a datetime. Default input for `datetime` type fields.

## Signature

```TypeScript
class DateFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'date-form-input';
  @Input() @Input() readonly: boolean;
  formControl: UntypedFormControl;
  config: DefaultFormComponentConfig<'date-form-input'>;
  min: void
  max: void
  yearRange: void
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'date-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### min

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### max

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### yearRange

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# FacetValueFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/facet-value-form-input/facet-value-form-input.component.ts" sourceLine="16" packageName="@vendure/admin-ui">}}

Allows the selection of multiple FacetValues via an autocomplete select input.
Should be used with `ID` type **list** fields which represent FacetValue IDs.

## Signature

```TypeScript
class FacetValueFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'facet-value-form-input';
  readonly readonly isListInput = true;
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
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### isListInput

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="InputComponentConfig"  >}}

{{< member-description >}}{{< /member-description >}}

### valueTransformFn

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# NumberFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/number-form-input/number-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

Displays a number input. Default input for `int` and `float` type fields.

## Signature

```TypeScript
class NumberFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'number-form-input';
  @Input() @Input() readonly: boolean;
  formControl: UntypedFormControl;
  config: DefaultFormComponentConfig<'number-form-input'>;
  prefix: void
  suffix: void
  min: void
  max: void
  step: void
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'number-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### prefix

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### suffix

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### min

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### max

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### step

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PasswordFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/password-form-input/password-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

Displays a password text input. Should be used with `string` type fields.

## Signature

```TypeScript
class PasswordFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'password-form-input';
  readonly: boolean;
  formControl: UntypedFormControl;
  config: InputComponentConfig;
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="InputComponentConfig"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductSelectorFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/product-selector-form-input/product-selector-form-input.component.ts" sourceLine="20" packageName="@vendure/admin-ui">}}

Allows the selection of multiple ProductVariants via an autocomplete select input.
Should be used with `ID` type **list** fields which represent ProductVariant IDs.

## Signature

```TypeScript
class ProductSelectorFormInputComponent implements FormInputComponent, OnInit {
  static readonly static readonly id: DefaultFormComponentId = 'product-selector-form-input';
  readonly readonly isListInput = true;
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
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>
 * OnInit


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### isListInput

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="FormControl&#60;Array&#60;string | { id: string }&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentUiConfig&#60;'product-selector-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### selection$

{{< member-info kind="property" type="Observable&#60;Array&#60;GetProductVariantQuery['productVariant']&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => ProductSelectorFormInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### addProductVariant

{{< member-info kind="method" type="(product: ProductSelectorSearchQuery['search']['items'][number]) => "  >}}

{{< member-description >}}{{< /member-description >}}

### removeProductVariant

{{< member-info kind="method" type="(id: string) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# RelationFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/relation-form-input/relation-form-input.component.ts" sourceLine="17" packageName="@vendure/admin-ui">}}

The default input component for `relation` type custom fields. Allows the selection
of a ProductVariant, Product, Customer or Asset. For other entity types, a custom
implementation will need to be defined. See <a href='/admin-ui-api/custom-input-components/register-form-input-component#registerforminputcomponent'>registerFormInputComponent</a>.

## Signature

```TypeScript
class RelationFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'relation-form-input';
  @Input() @Input() readonly: boolean;
  formControl: UntypedFormControl;
  config: RelationCustomFieldConfig;
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="RelationCustomFieldConfig"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# RichTextFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/rich-text-form-input/rich-text-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

Uses the <a href='/admin-ui-api/components/rich-text-editor-component#richtexteditorcomponent'>RichTextEditorComponent</a> as in input for `text` type fields.

## Signature

```TypeScript
class RichTextFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'rich-text-form-input';
  readonly: boolean;
  formControl: UntypedFormControl;
  config: DefaultFormComponentConfig<'rich-text-form-input'>;
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'rich-text-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SelectFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/select-form-input/select-form-input.component.ts" sourceLine="18" packageName="@vendure/admin-ui">}}

Uses a select input to allow the selection of a string value. Should be used with
`string` type fields with options.

## Signature

```TypeScript
class SelectFormInputComponent implements FormInputComponent, OnInit {
  static readonly static readonly id: DefaultFormComponentId = 'select-form-input';
  @Input() @Input() readonly: boolean;
  formControl: UntypedFormControl;
  config: DefaultFormComponentConfig<'select-form-input'> & CustomFieldConfigFragment;
  uiLanguage$: Observable<LanguageCode>;
  options: void
  constructor(dataService: DataService)
  ngOnInit() => ;
  trackByFn(index: number, item: any) => ;
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>
 * OnInit


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'select-form-input'&#62; &#38; CustomFieldConfigFragment"  >}}

{{< member-description >}}{{< /member-description >}}

### uiLanguage$

{{< member-info kind="property" type="Observable&#60;<a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### options

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(dataService: <a href='/admin-ui-api/providers/data-service#dataservice'>DataService</a>) => SelectFormInputComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### trackByFn

{{< member-info kind="method" type="(index: number, item: any) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# TextFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/text-form-input/text-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

Uses a regular text form input. This is the default input for `string` and `localeString` type fields.

## Signature

```TypeScript
class TextFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'text-form-input';
  readonly: boolean;
  formControl: UntypedFormControl;
  config: DefaultFormComponentConfig<'text-form-input'>;
  prefix: void
  suffix: void
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'text-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### prefix

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### suffix

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# TextareaFormInputComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/dynamic-form-inputs/textarea-form-input/textarea-form-input.component.ts" sourceLine="14" packageName="@vendure/admin-ui">}}

Uses textarea form input. This is the default input for `text` type fields.

## Signature

```TypeScript
class TextareaFormInputComponent implements FormInputComponent {
  static readonly static readonly id: DefaultFormComponentId = 'textarea-form-input';
  readonly: boolean;
  formControl: UntypedFormControl;
  config: DefaultFormComponentConfig<'textarea-form-input'>;
  spellcheck: boolean
}
```
## Implements

 * <a href='/admin-ui-api/custom-input-components/form-input-component#forminputcomponent'>FormInputComponent</a>


## Members

### id

{{< member-info kind="property" type="<a href='/typescript-api/configurable-operation-def/default-form-component-id#defaultformcomponentid'>DefaultFormComponentId</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### readonly

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### formControl

{{< member-info kind="property" type="UntypedFormControl"  >}}

{{< member-description >}}{{< /member-description >}}

### config

{{< member-info kind="property" type="DefaultFormComponentConfig&#60;'textarea-form-input'&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### spellcheck

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
