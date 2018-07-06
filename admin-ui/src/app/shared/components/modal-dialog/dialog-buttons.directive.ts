import { Directive, TemplateRef } from '@angular/core';
import { ModalDialogComponent } from './modal-dialog.component';

/**
 * A helper directive used to correctly embed the modal buttons in the {@link ModalDialogComponent}.
 */
@Directive({selector: '[vdrDialogButtons]'})
export class DialogButtonsDirective {
    constructor(private modal: ModalDialogComponent<any>, private templateRef: TemplateRef<any>) {}

    ngOnInit() {
        this.modal.registerButtonsTemplate(this.templateRef);
    }
}
