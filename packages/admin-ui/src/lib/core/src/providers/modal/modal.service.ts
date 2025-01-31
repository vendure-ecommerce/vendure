import { Injectable } from '@angular/core';
import { Type } from '@vendure/common/lib/shared-types';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ModalDialogComponent } from '../../shared/components/modal-dialog/modal-dialog.component';
import { SimpleDialogComponent } from '../../shared/components/simple-dialog/simple-dialog.component';
import { OverlayHostService } from '../overlay-host/overlay-host.service';

import { Dialog, DialogConfig, ModalOptions } from './modal.types';
import { HlmDialogService } from '@spartan-ng/ui-dialog-helm';

/**
 * @description
 * This service is responsible for instantiating a ModalDialog component and
 * embedding the specified component within.
 *
 * @docsCategory services
 * @docsPage ModalService
 * @docsWeight 0
 */
@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor(private hlmDialogService: HlmDialogService) {}

    /**
     * @description
     * Create a modal from a component. The component must implement the {@link Dialog} interface.
     * Additionally, the component should include templates for the title and the buttons to be
     * displayed in the modal dialog. See example:
     *
     * @example
     * ```ts
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
     * ```html
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
        const contentClass = () => {
            switch (options?.size) {
                case 'sm':
                    return 'sm:!max-w-[450px]';
                case 'lg':
                    return 'sm:!max-w-[750px]';
                case 'xl':
                    return 'sm:!max-w-[900px]';
                default:
                    return 'sm:!max-w-[550px]';
            }
        };

        const dialogRef = this.hlmDialogService.open(ModalDialogComponent, {
            context: {
                options: options,
                childComponentType: component,
            },
            contentClass: contentClass(),
        });

        return new Observable<R>(subscriber => {
            dialogRef.closed$.subscribe(res => {
                console.log({ res });
                subscriber.next(res);
                subscriber.complete();
            });
        });
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
