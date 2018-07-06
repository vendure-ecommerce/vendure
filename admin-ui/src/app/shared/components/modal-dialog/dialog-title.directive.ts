import { Directive, TemplateRef } from '@angular/core';
import { ModalDialogComponent } from './modal-dialog.component';

/**
 * A helper directive used to correctly embed the modal title in the {@link ModalDialogComponent}.
 */
@Directive({selector: '[vdrDialogTitle]'})
export class DialogTitleDirective {
    constructor(private modal: ModalDialogComponent<any>, private templateRef: TemplateRef<any>) {}

    ngOnInit() {
        this.modal.registerTitleTemplate(this.templateRef);
    }
}
