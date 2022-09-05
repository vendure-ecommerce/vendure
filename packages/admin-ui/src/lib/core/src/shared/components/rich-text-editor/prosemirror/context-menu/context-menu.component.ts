import { ConnectedPosition, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnDestroy,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { RichTextEditorComponent } from '@vendure/admin-ui/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ContextMenuConfig, ContextMenuItem, ContextMenuService } from './context-menu.service';

export type DropdownPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

@Component({
    selector: 'vdr-context-menu',
    template: `
        <ng-template #contextMenu>
            <vdr-dropdown>
                <button class="context-menu-trigger" vdrDropdownTrigger [class.hidden]="hideTrigger$ | async">
                    <clr-icon
                        *ngIf="menuConfig?.iconShape as shape"
                        [attr.shape]="shape"
                        size="16"
                        class="mr2"
                    ></clr-icon>
                    <span class="title-label">{{ menuConfig?.title }}</span>
                </button>
                <vdr-dropdown-menu vdrPosition="bottom-right" customClasses="context-menu">
                    <ng-container *ngFor="let item of menuConfig?.items">
                        <button
                            class="context-menu-item"
                            *ngIf="item.enabled && item.separator !== true"
                            type="button"
                            (click)="clickItem(item)"
                        >
                            <div *ngIf="item.iconClass" class="cm-icon" [ngClass]="item.iconClass"></div>
                            {{ item.label }}
                        </button>
                        <div
                            *ngIf="item.enabled && item.separator"
                            class="dropdown-divider"
                            role="separator"
                        ></div>
                    </ng-container>
                </vdr-dropdown-menu>
            </vdr-dropdown>
        </ng-template>
    `,
    styleUrls: ['./context-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent implements AfterViewInit, OnDestroy {
    @Input('vdrPosition') private position: DropdownPosition = 'top-left';
    @ViewChild('contextMenu', { static: true }) private menuTemplate: TemplateRef<any>;

    menuConfig: ContextMenuConfig | undefined;
    hideTrigger$: Observable<boolean>;
    private triggerIsHidden = new BehaviorSubject<boolean>(false);
    private menuPortal: TemplatePortal<any>;
    private overlayRef: OverlayRef;
    private contextMenuSub: Subscription;
    private contentArea: HTMLDivElement;
    private hideTriggerHandler: (() => void) | undefined;

    constructor(
        private richTextEditor: RichTextEditorComponent,
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        public contextMenuService: ContextMenuService,
    ) {}

    onScroll = () => {
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.updatePosition();
        }
    };

    ngAfterViewInit() {
        // tslint:disable-next-line:no-non-null-assertion
        this.contentArea = document.querySelector('.content-area')!;
        this.menuPortal = new TemplatePortal(this.menuTemplate, this.viewContainerRef);

        this.hideTrigger$ = this.triggerIsHidden.asObservable().pipe(distinctUntilChanged());
        this.contentArea.addEventListener('scroll', this.onScroll, { passive: true });

        this.contextMenuSub = this.contextMenuService.contextMenu$.subscribe(contextMenuConfig => {
            this.overlayRef?.dispose();
            this.menuConfig = contextMenuConfig;
            if (contextMenuConfig) {
                this.overlayRef = this.overlay.create({
                    hasBackdrop: false,
                    positionStrategy: this.getPositionStrategy(contextMenuConfig.element),
                    maxHeight: '70vh',
                });
                this.overlayRef.attach(this.menuPortal);
                this.triggerIsHidden.next(false);

                const triggerButton = this.overlayRef.hostElement.querySelector('.context-menu-trigger');
                const editorMenu = this.richTextEditor.menuElement;
                if (triggerButton) {
                    this.hideTriggerHandler = () => {
                        if (
                            triggerButton.getBoundingClientRect().top <
                            editorMenu.getBoundingClientRect().bottom
                        ) {
                            this.triggerIsHidden.next(true);
                        } else {
                            this.triggerIsHidden.next(false);
                        }
                    };
                    this.contentArea.addEventListener('scroll', this.hideTriggerHandler, { passive: true });
                }
            } else {
                if (this.hideTriggerHandler) {
                    this.contentArea.removeEventListener('scroll', this.hideTriggerHandler);
                }
            }
        });
    }

    private setUpIntersectionObserver() {}

    ngOnDestroy(): void {
        this.overlayRef?.dispose();
        this.contextMenuSub?.unsubscribe();
        this.contentArea.removeEventListener('scroll', this.onScroll);
    }

    clickItem(item: ContextMenuItem) {
        item.onClick();
    }

    private getPositionStrategy(element: Element): PositionStrategy {
        const position: { [K in DropdownPosition]: ConnectedPosition } = {
            ['top-left']: {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
            },
            ['top-right']: {
                originX: 'end',
                originY: 'top',
                overlayX: 'end',
                overlayY: 'bottom',
            },
            ['bottom-left']: {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
            },
            ['bottom-right']: {
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top',
            },
        };

        const pos = position[this.position];

        return this.overlay
            .position()
            .flexibleConnectedTo(element)
            .withPositions([pos, this.invertPosition(pos)])
            .withViewportMargin(0)
            .withLockedPosition(false)
            .withPush(false);
    }

    /** Inverts an overlay position. */
    private invertPosition(pos: ConnectedPosition): ConnectedPosition {
        const inverted = { ...pos };
        inverted.originY = pos.originY === 'top' ? 'bottom' : 'top';
        inverted.overlayY = pos.overlayY === 'top' ? 'bottom' : 'top';

        return inverted;
    }
}
