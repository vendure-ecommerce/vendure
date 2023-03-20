import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { DataService } from '@vendure/admin-ui/core';
import { concat, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

@Component({
    selector: 'vdr-coupon-code-selector',
    templateUrl: './coupon-code-selector.component.html',
    styleUrls: ['./coupon-code-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouponCodeSelectorComponent implements OnInit {
    @Input() couponCodes: string[];
    @Input() control: UntypedFormControl | undefined;
    @Output() addCouponCode = new EventEmitter<string>();
    @Output() removeCouponCode = new EventEmitter<string>();
    availableCouponCodes$: Observable<Array<{ code: string; promotionName: string }>>;
    couponCodeInput$ = new Subject<string>();
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.availableCouponCodes$ = concat(
            this.couponCodeInput$.pipe(
                distinctUntilChanged(),
                switchMap(
                    term =>
                        this.dataService.promotion.getPromotions(10, 0, {
                            couponCode: { contains: term },
                        }).single$,
                ),
                map(({ promotions }) =>
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    promotions.items.map(p => ({ code: p.couponCode!, promotionName: p.name })),
                ),
                startWith([]),
            ),
        );
        if (!this.control) {
            this.control = new UntypedFormControl(this.couponCodes ?? []);
        }
    }
}
