---
title: "RichTextEditorComponent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RichTextEditorComponent

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/shared/components/rich-text-editor/rich-text-editor.component.ts" sourceLine="32" packageName="@vendure/admin-ui" />

A rich text (HTML) editor based on Prosemirror (https://prosemirror.net/)

*Example*

```HTML
<vdr-rich-text-editor
    [(ngModel)]="description"
    label="Description"
></vdr-rich-text-editor>
```

```ts title="Signature"
class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    @Input() label: string;
    @HostBinding('class.readonly')
    _readonly = false;
    onChange: (val: any) => void;
    onTouch: () => void;
    constructor(changeDetector: ChangeDetectorRef, prosemirrorService: ProsemirrorService, viewContainerRef: ViewContainerRef, contextMenuService: ContextMenuService)
    menuElement: HTMLDivElement | null
    ngAfterViewInit() => ;
    ngOnDestroy() => ;
    registerOnChange(fn: any) => ;
    registerOnTouched(fn: any) => ;
    setDisabledState(isDisabled: boolean) => ;
    writeValue(value: any) => ;
}
```
* Implements: <code>ControlValueAccessor</code>, <code>AfterViewInit</code>, <code>OnDestroy</code>



<div className="members-wrapper">

### label

<MemberInfo kind="property" type={`string`}   />


### _readonly

<MemberInfo kind="property" type={``}   />


### onChange

<MemberInfo kind="property" type={`(val: any) =&#62; void`}   />


### onTouch

<MemberInfo kind="property" type={`() =&#62; void`}   />


### constructor

<MemberInfo kind="method" type={`(changeDetector: ChangeDetectorRef, prosemirrorService: ProsemirrorService, viewContainerRef: ViewContainerRef, contextMenuService: ContextMenuService) => RichTextEditorComponent`}   />


### menuElement

<MemberInfo kind="property" type={`HTMLDivElement | null`}   />


### ngAfterViewInit

<MemberInfo kind="method" type={`() => `}   />


### ngOnDestroy

<MemberInfo kind="method" type={`() => `}   />


### registerOnChange

<MemberInfo kind="method" type={`(fn: any) => `}   />


### registerOnTouched

<MemberInfo kind="method" type={`(fn: any) => `}   />


### setDisabledState

<MemberInfo kind="method" type={`(isDisabled: boolean) => `}   />


### writeValue

<MemberInfo kind="method" type={`(value: any) => `}   />




</div>
