import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService, Fulfillment, ModalService, OrderDetail } from '@vendure/admin-ui/core';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { FulfillmentUpdateTrackingCodeComponent } from '../fulfillment-update-tracking-code-dialog/fulfillment-update-tracking-code-dialog.component';

@Component({
    selector: 'vdr-fulfillment-card',
    templateUrl: './fulfillment-card.component.html',
    styleUrls: ['./fulfillment-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillmentCardComponent {
    @Input() fulfillment: Fulfillment.Fragment | undefined;
    @Input() order: OrderDetail.Fragment;
    @Output() transitionState = new EventEmitter<string>();

    constructor(private modalService: ModalService, private dataService: DataService) {}

    nextSuggestedState(): string | undefined {
        if (!this.fulfillment) {
            return;
        }
        const { nextStates } = this.fulfillment;
        const namedStateOrDefault = (targetState: string) =>
            nextStates.includes(targetState) ? targetState : nextStates[0];
        switch (this.fulfillment?.state) {
            case 'Pending':
                return namedStateOrDefault('Shipped');
            case 'Shipped':
                return namedStateOrDefault('Delivered');
            default:
                return nextStates.find(s => s !== 'Cancelled');
        }
    }

    nextOtherStates(): string[] {
        if (!this.fulfillment) {
            return [];
        }
        const suggested = this.nextSuggestedState();
        return this.fulfillment.nextStates.filter(s => s !== suggested);
    }

    updateTrackingCode() {
        this.modalService
            .fromComponent(FulfillmentUpdateTrackingCodeComponent, {
                size: 'md',
                locals: {
                    fulfillment: this.fulfillment,
                },
            })
            .pipe(
                switchMap(input => {
                    if (!this.fulfillment || !input) return of(undefined);

                    return this.dataService.order
                        .updatePendingFulfillment({
                            fulfillmentId: this.fulfillment.id,
                            method: input.method,
                            trackingCode: input.trackingCode,
                        })
                        .pipe(map(data => data.updatePendingFulfillment));
                }),
            )
            .subscribe(data => {
                if (data) this.transitionState.next('Pending');
            });
    }
}
