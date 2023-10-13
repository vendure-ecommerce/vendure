import {
    Component,
    ContentChild,
    ContentChildren,
    OnInit,
    QueryList,
    TemplateRef,
    Type,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { Observable, Subject, map } from 'rxjs';

import { DataService } from '../../../data/providers/data.service';
import { I18nService } from '../../../providers/i18n/i18n.service';
import { LanguageCode } from '../../../common/generated-types';
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
    uiLanguageAndLocale$: Observable<[LanguageCode, string | undefined]>;
    direction$: Observable<'ltr' | 'rtl'>;

    childComponentType: Type<T>;
    closeModal: (result?: any) => void;
    titleTemplateRef$ = new Subject<TemplateRef<any>>();
    buttonsTemplateRef$ = new Subject<TemplateRef<any>>();
    options?: ModalOptions<T>;

    /**
     *
     */
    constructor(private i18nService: I18nService, private dataService: DataService) {}

    ngOnInit(): void {
        this.uiLanguageAndLocale$ = this.dataService.client
            .uiState()
            .stream$.pipe(map(({ uiState }) => [uiState.language, uiState.locale ?? undefined]));

        this.direction$ = this.uiLanguageAndLocale$.pipe(
            map(([languageCode]) => {
                return this.i18nService.isRTL(languageCode) ? 'rtl' : 'ltr';
            }),
        );
    }

    /**
     * This callback is invoked when the childComponentType is instantiated in the
     * template by the {@link DialogComponentOutletComponent}.
     * Once we have the instance, we can set the resolveWith function and any
     * locals which were specified in the config.
     */
    onCreate(componentInstance: T) {
        componentInstance.resolveWith = (result?: any) => {
            this.closeModal(result);
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
        if (status === false) {
            this.closeModal();
        }
    }
}
