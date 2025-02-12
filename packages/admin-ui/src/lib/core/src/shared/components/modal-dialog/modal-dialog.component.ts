import { Component, inject, OnInit, TemplateRef, Type } from '@angular/core';
import { Subject } from 'rxjs';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';

import {
    LocalizationDirectionType,
    LocalizationService,
} from '../../../providers/localization/localization.service';
import { Dialog, ModalOptions } from '../../../providers/modal/modal.types';

import { DialogButtonsDirective } from './dialog-buttons.directive';

/**
 * This component should only be instantiated dynamically by the ModalService. It should not be used
 * directly in templates. See {@link ModalService.fromComponent} method for more detail.
 */
@Component({
    selector: 'vdr-modal-dialog',
    templateUrl: './modal-dialog.component.html',
    styleUrls: ['./modal-dialog.component.scss'],
})
export class ModalDialogComponent<T extends Dialog<any>> implements OnInit {
    direction$: LocalizationDirectionType;

    titleTemplateRef$ = new Subject<TemplateRef<any>>();
    buttonsTemplateRef$ = new Subject<TemplateRef<any>>();

    private readonly _dialogRef = inject<BrnDialogRef<T>>(BrnDialogRef);
    private readonly _dialogContext = injectBrnDialogContext<{
        options?: ModalOptions<T>;
        childComponentType: Type<T>;
    }>();

    options = this._dialogContext.options;
    childComponentType = this._dialogContext.childComponentType;

    /**
     *
     */
    constructor(private localizationService: LocalizationService) {}

    ngOnInit(): void {
        this.direction$ = this.localizationService.direction$;
    }

    /**
     * This callback is invoked when the childComponentType is instantiated in the
     * template by the {@link DialogComponentOutletComponent}.
     * Once we have the instance, we can set the resolveWith function and any
     * locals which were specified in the config.
     */
    onCreate(componentInstance: T) {
        componentInstance.resolveWith = (result?: any) => {
            this._dialogRef.close(result);
        };
        if (this.options && this.options.locals) {
            // eslint-disable-next-line
            for (const key in this.options.locals) {
                componentInstance[key] = this.options.locals[key] as T[Extract<keyof T, string>];
            }
        }
    }

    /**
     * This should be called by the {@link DialogTitleDirective} only
     */
    registerTitleTemplate(titleTemplateRef: TemplateRef<any>) {
        this.titleTemplateRef$.next(titleTemplateRef);
    }

    /**
     * This should be called by the {@link DialogButtonsDirective} only
     */
    registerButtonsTemplate(buttonsTemplateRef: TemplateRef<any>) {
        this.buttonsTemplateRef$.next(buttonsTemplateRef);
    }

    /**
     * Called when the modal is closed by clicking the X or the mask.
     */
    modalOpenChange(status: any) {
        this._dialogRef.close();
    }
}
