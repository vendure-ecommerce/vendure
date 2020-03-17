import {
    ConnectedPosition,
    HorizontalConnectionPos,
    Overlay,
    OverlayRef,
    PositionStrategy,
    VerticalConnectionPos,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { DropdownTriggerDirective } from './dropdown-trigger.directive';
import { DropdownComponent } from './dropdown.component';

export type DropdownPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * A dropdown menu modelled on the Clarity Dropdown component (https://v1.clarity.design/dropdowns).
 *
 * This was created because the Clarity implementation (at this time) does not handle edge detection. Instead
 * we make use of the Angular CDK's Overlay module to manage the positioning.
 *
 * The API of this component (and its related Components & Directives) are based on the Clarity version,
 * albeit only a subset which is currently used in this application.
 */
@Component({
    selector: 'vdr-dropdown-menu',
    template: `
        <ng-template #menu>
            <div class="dropdown open">
                <div class="dropdown-menu">
                    <ng-content></ng-content>
                </div>
            </div>
        </ng-template>
    `,
    styleUrls: ['./dropdown-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent implements AfterViewInit, OnInit, OnDestroy {
    @Input('vdrPosition') private position: DropdownPosition = 'bottom-left';
    @ViewChild('menu', { static: true }) private menuTemplate: TemplateRef<any>;
    private menuPortal: TemplatePortal<any>;
    private overlayRef: OverlayRef;
    private backdropClickSub: Subscription;

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private dropdown: DropdownComponent,
    ) {}

    ngOnInit(): void {
        this.dropdown.onOpenChange(isOpen => {
            if (isOpen) {
                this.overlayRef.attach(this.menuPortal);
            } else {
                this.overlayRef.detach();
            }
        });
    }

    ngAfterViewInit() {
        this.overlayRef = this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'clear-backdrop',
            positionStrategy: this.getPositionStrategy(),
        });
        this.menuPortal = new TemplatePortal(this.menuTemplate, this.viewContainerRef);
        this.backdropClickSub = this.overlayRef.backdropClick().subscribe(() => {
            this.dropdown.toggleOpen();
        });
    }

    ngOnDestroy(): void {
        this.overlayRef.dispose();
        if (this.backdropClickSub) {
            this.backdropClickSub.unsubscribe();
        }
    }

    private getPositionStrategy(): PositionStrategy {
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
            .flexibleConnectedTo(this.dropdown.trigger)
            .withPositions([pos, this.invertPosition(pos)])
            .withViewportMargin(12)
            .withPush(true);
    }

    /** Inverts an overlay position. */
    private invertPosition(pos: ConnectedPosition): ConnectedPosition {
        const inverted = { ...pos };
        inverted.originY = pos.originY === 'top' ? 'bottom' : 'top';
        inverted.overlayY = pos.overlayY === 'top' ? 'bottom' : 'top';

        return inverted;
    }
}
