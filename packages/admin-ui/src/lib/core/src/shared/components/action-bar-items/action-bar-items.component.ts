import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Injector,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { BehaviorSubject, combineLatest, mergeAll, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ActionBarLocationId } from '../../../common/component-registry-types';
import { DataService } from '../../../data/providers/data.service';
import {
    ActionBarButtonState,
    ActionBarContext,
    ActionBarItem,
} from '../../../providers/nav-builder/nav-builder-types';
import { NavBuilderService } from '../../../providers/nav-builder/nav-builder.service';
import { NotificationService } from '../../../providers/notification/notification.service';

@Component({
    selector: 'vdr-action-bar-items',
    templateUrl: './action-bar-items.component.html',
    styleUrls: ['./action-bar-items.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionBarItemsComponent implements OnInit, OnChanges {
    @HostBinding('attr.data-location-id')
    @Input()
    locationId: ActionBarLocationId;

    items$: Observable<ActionBarItem[]>;
    buttonStates: { [id: string]: Observable<ActionBarButtonState> } = {};
    private locationId$ = new BehaviorSubject<string>('');

    constructor(
        private navBuilderService: NavBuilderService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private notificationService: NotificationService,
        private injector: Injector,
    ) {}

    ngOnInit() {
        this.items$ = combineLatest(this.navBuilderService.actionBarConfig$, this.locationId$).pipe(
            map(([items, locationId]) => items.filter(config => config.locationId === locationId)),
            tap(items => {
                const context = this.createContext();
                for (const item of items) {
                    const buttonState$ =
                        typeof item.buttonState === 'function'
                            ? item.buttonState(context)
                            : of({
                                  disabled: false,
                                  visible: true,
                              });
                    this.buttonStates[item.id] = buttonState$;
                }
            }),
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('locationId' in changes) {
            this.locationId$.next(changes['locationId'].currentValue);
        }
    }

    handleClick(event: MouseEvent, item: ActionBarItem) {
        if (typeof item.onClick === 'function') {
            item.onClick(event, this.createContext());
        }
    }

    getRouterLink(item: ActionBarItem): any[] | null {
        return this.navBuilderService.getRouterLink(
            { routerLink: item.routerLink, context: this.createContext() },
            this.route,
        );
    }

    getButtonStyles(item: ActionBarItem): string[] {
        const styles = ['button'];
        if (item.buttonStyle && item.buttonStyle === 'link') {
            styles.push('btn-link');
            return styles;
        }
        styles.push(this.getButtonColorClass(item));
        return styles;
    }

    private getButtonColorClass(item: ActionBarItem): string {
        switch (item.buttonColor) {
            case undefined:
                return '';
            case 'primary':
                return item.buttonStyle === 'outline' ? 'btn-outline' : 'primary';
            case 'success':
                return item.buttonStyle === 'outline' ? 'btn-success-outline' : 'success';
            case 'warning':
                return item.buttonStyle === 'outline' ? 'btn-warning-outline' : 'warning';
            default:
                assertNever(item.buttonColor);
                return '';
        }
    }

    private createContext(): ActionBarContext {
        return {
            route: this.route,
            injector: this.injector,
            dataService: this.dataService,
            notificationService: this.notificationService,
        };
    }
}
