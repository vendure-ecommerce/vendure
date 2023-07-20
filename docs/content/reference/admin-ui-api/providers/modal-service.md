---
title: "ModalService"
weight: 10
date: 2023-07-14T16:57:51.099Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ModalService
<div class="symbol">


# ModalService

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.service.ts" sourceLine="21" packageName="@vendure/admin-ui">}}

This service is responsible for instantiating a ModalDialog component and
embedding the specified component within.

## Signature

```TypeScript
class ModalService {
  constructor(componentFactoryResolver: ComponentFactoryResolver, overlayHostService: OverlayHostService)
  fromComponent(component: Type<T> & Type<Dialog<R>>, options?: ModalOptions<T>) => Observable<R | undefined>;
  dialog(config: DialogConfig<T>) => Observable<T | undefined>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(componentFactoryResolver: ComponentFactoryResolver, overlayHostService: OverlayHostService) => ModalService"  >}}

{{< member-description >}}{{< /member-description >}}

### fromComponent

{{< member-info kind="method" type="(component: Type&#60;T&#62; &#38; Type&#60;<a href='/admin-ui-api/providers/modal-service#dialog'>Dialog</a>&#60;R&#62;&#62;, options?: <a href='/admin-ui-api/providers/modal-service#modaloptions'>ModalOptions</a>&#60;T&#62;) => Observable&#60;R | undefined&#62;"  >}}

{{< member-description >}}Create a modal from a component. The component must implement the <a href='/admin-ui-api/providers/modal-service#dialog'>Dialog</a> interface.
Additionally, the component should include templates for the title and the buttons to be
displayed in the modal dialog. See example:

*Example*

```HTML
class MyDialog implements Dialog {
 resolveWith: (result?: any) => void;

 okay() {
   doSomeWork().subscribe(result => {
     this.resolveWith(result);
   })
 }

 cancel() {
   this.resolveWith(false);
 }
}
```

*Example*

```HTML
<ng-template vdrDialogTitle>Title of the modal</ng-template>

<p>
  My Content
</p>

<ng-template vdrDialogButtons>
  <button type="button"
          class="btn"
          (click)="cancel()">Cancel</button>
  <button type="button"
          class="btn btn-primary"
          (click)="okay()">Okay</button>
</ng-template>
```{{< /member-description >}}

### dialog

{{< member-info kind="method" type="(config: <a href='/admin-ui-api/providers/modal-service#dialogconfig'>DialogConfig</a>&#60;T&#62;) => Observable&#60;T | undefined&#62;"  >}}

{{< member-description >}}Displays a modal dialog with the provided title, body and buttons.{{< /member-description >}}


</div>
<div class="symbol">


# Dialog

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.types.ts" sourceLine="9" packageName="@vendure/admin-ui">}}

Any component intended to be used with the ModalService.fromComponent() method must implement
this interface.

## Signature

```TypeScript
interface Dialog<R = any> {
  resolveWith: (result?: R) => void;
}
```
## Members

### resolveWith

{{< member-info kind="property" type="(result?: R) =&#62; void"  >}}

{{< member-description >}}Function to be invoked in order to close the dialog when the action is complete.
The Observable returned from the .fromComponent() method will emit the value passed
to this method and then complete.{{< /member-description >}}


</div>
<div class="symbol">


# DialogConfig

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.types.ts" sourceLine="33" packageName="@vendure/admin-ui">}}

Configures a generic modal dialog.

## Signature

```TypeScript
interface DialogConfig<T> {
  title: string;
  body?: string;
  translationVars?: { [key: string]: string | number };
  buttons: Array<DialogButtonConfig<T>>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```
## Members

### title

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### body

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### translationVars

{{< member-info kind="property" type="{ [key: string]: string | number }"  >}}

{{< member-description >}}{{< /member-description >}}

### buttons

{{< member-info kind="property" type="Array&#60;DialogButtonConfig&#60;T&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### size

{{< member-info kind="property" type="'sm' | 'md' | 'lg' | 'xl'"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ModalOptions

{{< generation-info sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.types.ts" sourceLine="48" packageName="@vendure/admin-ui">}}

Options to configure the behaviour of the modal.

## Signature

```TypeScript
interface ModalOptions<T> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verticalAlign?: 'top' | 'center' | 'bottom';
  closable?: boolean;
  locals?: Partial<T>;
}
```
## Members

### size

{{< member-info kind="property" type="'sm' | 'md' | 'lg' | 'xl'"  >}}

{{< member-description >}}Sets the width of the dialog{{< /member-description >}}

### verticalAlign

{{< member-info kind="property" type="'top' | 'center' | 'bottom'"  >}}

{{< member-description >}}Sets the vertical alignment of the dialog{{< /member-description >}}

### closable

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}When true, the "x" icon is shown
and clicking it or the mask will close the dialog{{< /member-description >}}

### locals

{{< member-info kind="property" type="Partial&#60;T&#62;"  >}}

{{< member-description >}}Values to be passed directly to the component being instantiated inside the dialog.{{< /member-description >}}


</div>
