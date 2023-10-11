---
title: "ModalService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ModalService

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.service.ts" sourceLine="21" packageName="@vendure/admin-ui" />

This service is responsible for instantiating a ModalDialog component and
embedding the specified component within.

```ts title="Signature"
class ModalService {
    constructor(overlayHostService: OverlayHostService)
    fromComponent(component: Type<T> & Type<Dialog<R>>, options?: ModalOptions<T>) => Observable<R | undefined>;
    dialog(config: DialogConfig<T>) => Observable<T | undefined>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(overlayHostService: OverlayHostService) => ModalService`}   />


### fromComponent

<MemberInfo kind="method" type={`(component: Type&#60;T&#62; &#38; Type&#60;<a href='/reference/admin-ui-api/services/modal-service#dialog'>Dialog</a>&#60;R&#62;&#62;, options?: <a href='/reference/admin-ui-api/services/modal-service#modaloptions'>ModalOptions</a>&#60;T&#62;) => Observable&#60;R | undefined&#62;`}   />

Create a modal from a component. The component must implement the <a href='/reference/admin-ui-api/services/modal-service#dialog'>Dialog</a> interface.
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
```
### dialog

<MemberInfo kind="method" type={`(config: <a href='/reference/admin-ui-api/services/modal-service#dialogconfig'>DialogConfig</a>&#60;T&#62;) => Observable&#60;T | undefined&#62;`}   />

Displays a modal dialog with the provided title, body and buttons.


</div>


## Dialog

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.types.ts" sourceLine="9" packageName="@vendure/admin-ui" />

Any component intended to be used with the ModalService.fromComponent() method must implement
this interface.

```ts title="Signature"
interface Dialog<R = any> {
    resolveWith: (result?: R) => void;
}
```

<div className="members-wrapper">

### resolveWith

<MemberInfo kind="property" type={`(result?: R) =&#62; void`}   />

Function to be invoked in order to close the dialog when the action is complete.
The Observable returned from the .fromComponent() method will emit the value passed
to this method and then complete.


</div>


## DialogConfig

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.types.ts" sourceLine="33" packageName="@vendure/admin-ui" />

Configures a generic modal dialog.

```ts title="Signature"
interface DialogConfig<T> {
    title: string;
    body?: string;
    translationVars?: { [key: string]: string | number };
    buttons: Array<DialogButtonConfig<T>>;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

<div className="members-wrapper">

### title

<MemberInfo kind="property" type={`string`}   />


### body

<MemberInfo kind="property" type={`string`}   />


### translationVars

<MemberInfo kind="property" type={`{ [key: string]: string | number }`}   />


### buttons

<MemberInfo kind="property" type={`Array&#60;DialogButtonConfig&#60;T&#62;&#62;`}   />


### size

<MemberInfo kind="property" type={`'sm' | 'md' | 'lg' | 'xl'`}   />




</div>


## ModalOptions

<GenerationInfo sourceFile="packages/admin-ui/src/lib/core/src/providers/modal/modal.types.ts" sourceLine="48" packageName="@vendure/admin-ui" />

Options to configure the behaviour of the modal.

```ts title="Signature"
interface ModalOptions<T> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    verticalAlign?: 'top' | 'center' | 'bottom';
    closable?: boolean;
    locals?: Partial<T>;
}
```

<div className="members-wrapper">

### size

<MemberInfo kind="property" type={`'sm' | 'md' | 'lg' | 'xl'`}   />

Sets the width of the dialog
### verticalAlign

<MemberInfo kind="property" type={`'top' | 'center' | 'bottom'`}   />

Sets the vertical alignment of the dialog
### closable

<MemberInfo kind="property" type={`boolean`}   />

When true, the "x" icon is shown
and clicking it or the mask will close the dialog
### locals

<MemberInfo kind="property" type={`Partial&#60;T&#62;`}   />

Values to be passed directly to the component being instantiated inside the dialog.


</div>
