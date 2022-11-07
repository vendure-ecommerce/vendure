import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { Type } from '@vendure/common/lib/shared-types';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';
import { SimpleDialogComponent } from '../../shared/components/simple-dialog/simple-dialog.component';
import { OverlayHostService } from '../overlay-host/overlay-host.service';

/**
 * @description
 * Any component intended to be used with the ModalService.fromComponent() method must implement
 * this interface.
 *
 * @docsCategory providers
 * @docsPage ModalService
 */
export interface Dialog<R = any> {
    /**
     * @description
     * Function to be invoked in order to close the dialog when the action is complete.
     * The Observable returned from the .fromComponent() method will emit the value passed
     * to this method and then complete.
     */
    resolveWith: (result?: R) => void;
}

export interface DialogButtonConfig<T> {
    label: string;
    type: 'secondary' | 'primary' | 'danger';
    translationVars?: Record<string, string | number>;
    returnValue?: T;
}

/**
 * @description
 * Configures a generic modal dialog.
 *
 * @docsCategory providers
 * @docsPage ModalService
 */
export interface DialogConfig<T> {
    title: string;
    body?: string;
    translationVars?: { [key: string]: string | number };
    buttons: Array<DialogButtonConfig<T>>;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * @description
 * Options to configure the behaviour of the modal.
 *
 * @docsCategory providers
 * @docsPage ModalService
 */
export interface ModalOptions<T> {
    /**
     * @description
     * Sets the width of the dialog
     */
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * @description
     * Sets the vertical alignment of the dialog
     */
    verticalAlign?: 'top' | 'center' | 'bottom';
    /**
     * @description
     * When true, the "x" icon is shown
     * and clicking it or the mask will close the dialog
     */
    closable?: boolean;
    /**
     * @description
     * Values to be passed directly to the component being instantiated inside the dialog.
     */
    locals?: Partial<T>;
}

/**
 * @description
 * This service is responsible for instantiating a ModalDialog component and
 * embedding the specified component within.
 *
 * @docsCategory providers
 * @docsPage ModalService
 * @docsWeight 0
 */
@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private overlayHostService: OverlayHostService,
    ) {}

    /**
     * @description
     * Create a modal from a component. The component must implement the {@link Dialog} interface.
     * Additionally, the component should include templates for the title and the buttons to be
     * displayed in the modal dialog. See example:
     *
     * @example
     * ```HTML
     * class MyDialog implements Dialog {
     *  resolveWith: (result?: any) => void;
     *
     *  okay() {
     *    doSomeWork().subscribe(result => {
     *      this.resolveWith(result);
     *    })
     *  }
     *
     *  cancel() {
     *    this.resolveWith(false);
     *  }
     * }
     * ```
     *
     * @example
     * ```HTML
     * <ng-template vdrDialogTitle>Title of the modal</ng-template>
     *
     * <p>
     *   My Content
     * </p>
     *
     * <ng-template vdrDialogButtons>
     *   <button type="button"
     *           class="btn"
     *           (click)="cancel()">Cancel</button>
     *   <button type="button"
     *           class="btn btn-primary"
     *           (click)="okay()">Okay</button>
     * </ng-template>
     * ```
     */
    fromComponent<T extends Dialog<any>, R>(
        component: Type<T> & Type<Dialog<R>>,
        options?: ModalOptions<T>,
    ): Observable<R | undefined> {
        const modalFactory = this.componentFactoryResolver.resolveComponentFactory(ModalDialogComponent);

        return from(this.overlayHostService.getHostView()).pipe(
            mergeMap(hostView => {
                const modalComponentRef = hostView.createComponent(modalFactory);
                const modalInstance: ModalDialogComponent<any> = modalComponentRef.instance;
                modalInstance.childComponentType = component;
                modalInstance.options = options;

                return new Observable<R>(subscriber => {
                    modalInstance.closeModal = (result: R) => {
                        modalComponentRef.destroy();
                        subscriber.next(result);
                        subscriber.complete();
                    };
                });
            }),
        );
    }

    /**
     * @description
     * Displays a modal dialog with the provided title, body and buttons.
     */
    dialog<T>(config: DialogConfig<T>): Observable<T | undefined> {
        return this.fromComponent(SimpleDialogComponent, {
            locals: config,
            size: config.size,
        });
    }
}
