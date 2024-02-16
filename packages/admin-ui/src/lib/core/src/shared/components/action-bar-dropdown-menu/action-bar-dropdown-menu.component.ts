import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Self,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ActionBarLocationId } from '../../../common/component-registry-types';
import { DataService } from '../../../data/providers/data.service';
import {
    ActionBarButtonState,
    ActionBarContext,
    ActionBarDropdownMenuItem,
} from '../../../providers/nav-builder/nav-builder-types';
import { NavBuilderService } from '../../../providers/nav-builder/nav-builder.service';
import { NotificationService } from '../../../providers/notification/notification.service';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
    selector: 'vdr-action-bar-dropdown-menu',
    templateUrl: './action-bar-dropdown-menu.component.html',
    styleUrls: ['./action-bar-dropdown-menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        // This is a rather involved work-around to allow the {@link DropdownItemDirective} to
        // be able to access the DropdownComponent instance even when it is not a direct parent,
        // as is the case when this component is used.
        {
            provide: DropdownComponent,
            useFactory: (actionBarDropdownMenuComponent: ActionBarDropdownMenuComponent) => {
                return new Promise(resolve =>
                    actionBarDropdownMenuComponent.onDropdownComponentResolved(cmp => resolve(cmp)),
                );
            },
            deps: [[new Self(), ActionBarDropdownMenuComponent]],
        },
    ],
})
export class ActionBarDropdownMenuComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild('dropdownComponent')
    dropdownComponent: DropdownComponent;

    @Input()
    alwaysShow = false;

    @HostBinding('attr.data-location-id')
    @Input()
    locationId: ActionBarLocationId;

    items$: Observable<ActionBarDropdownMenuItem[]>;
    buttonStates: { [id: string]: Observable<ActionBarButtonState> } = {};
    private locationId$ = new BehaviorSubject<string>('');
    private onDropdownComponentResolvedFn: (dropdownComponent: DropdownComponent) => void;

    constructor(
        private navBuilderService: NavBuilderService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private notificationService: NotificationService,
        private injector: Injector,
    ) {}

    ngOnInit() {
        this.items$ = combineLatest(this.navBuilderService.actionBarDropdownConfig$, this.locationId$).pipe(
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

    ngAfterViewInit() {
        if (this.onDropdownComponentResolvedFn) {
            this.onDropdownComponentResolvedFn(this.dropdownComponent);
        }
    }

    onDropdownComponentResolved(fn: (dropdownComponent: DropdownComponent) => void) {
        this.onDropdownComponentResolvedFn = fn;
    }

    handleClick(event: MouseEvent, item: ActionBarDropdownMenuItem) {
        if (typeof item.onClick === 'function') {
            item.onClick(event, this.createContext());
        }
    }

    getRouterLink(item: ActionBarDropdownMenuItem): any[] | null {
        return this.navBuilderService.getRouterLink(
            { routerLink: item.routerLink, context: this.createContext() },
            this.route,
        );
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
