---
title: "RichTextEditorComponent"
weight: 10
date: 2023-07-14T16:57:51.246Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# RichTextEditorComponent
<div class="symbol">


# RichTextEditorComponent

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/shared/components/rich-text-editor/rich-text-editor.component.ts" sourceLine="32" packageName="@vendure/admin-ui">}}

A rich text (HTML) editor based on Prosemirror (https://prosemirror.net/)

*Example*

```HTML
<vdr-rich-text-editor
    [(ngModel)]="description"
    label="Description"
></vdr-rich-text-editor>
```

## Signature

```TypeScript
class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() @Input() label: string;
  @HostBinding('class.readonly') @HostBinding('class.readonly')
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
## Implements

 * ControlValueAccessor
 * AfterViewInit
 * OnDestroy


## Members

### label

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### _readonly

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### onChange

{{< member-info kind="property" type="(val: any) =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### onTouch

{{< member-info kind="property" type="() =&#62; void"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(changeDetector: ChangeDetectorRef, prosemirrorService: ProsemirrorService, viewContainerRef: ViewContainerRef, contextMenuService: ContextMenuService) => RichTextEditorComponent"  >}}

{{< member-description >}}{{< /member-description >}}

### menuElement

{{< member-info kind="property" type="HTMLDivElement | null"  >}}

{{< member-description >}}{{< /member-description >}}

### ngAfterViewInit

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### ngOnDestroy

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### registerOnChange

{{< member-info kind="method" type="(fn: any) => "  >}}

{{< member-description >}}{{< /member-description >}}

### registerOnTouched

{{< member-info kind="method" type="(fn: any) => "  >}}

{{< member-description >}}{{< /member-description >}}

### setDisabledState

{{< member-info kind="method" type="(isDisabled: boolean) => "  >}}

{{< member-description >}}{{< /member-description >}}

### writeValue

{{< member-info kind="method" type="(value: any) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
