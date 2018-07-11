import { Directive, OnInit, TemplateRef } from '@angular/core';

import { ModalDialogComponent } from './modal-dialog.component';

/**
 * A helper directive used to correctly embed the modal title in the {@link ModalDialogComponent}.
 */
@Directive({ selector: '[vdrDialogTitle]' })
export class DialogTitleDirective implements OnInit {
    constructor(private modal: ModalDialogComponent<any>, private templateRef: TemplateRef<any>) {}

    ngOnInit() {
        this.modal.registerTitleTemplate(this.templateRef);
    }
}
