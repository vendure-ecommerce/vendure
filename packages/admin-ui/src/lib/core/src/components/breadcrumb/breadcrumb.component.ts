import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BreadcrumbService } from '../../providers/breadcrumb/breadcrumb.service';

/**
 * A breadcrumbs component which reads the route config and any route that has a `data.breadcrumb` property will
 * be displayed in the breadcrumb trail.
 *
 * The `breadcrumb` property can be a string or a function. If a function, it will be passed the route's `data`
 * object (which will include all resolved keys) and any route params, and should return a BreadcrumbValue.
 *
 * See the test config to get an idea of allowable configs for breadcrumbs.
 */
@Component({
    selector: 'vdr-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
    breadcrumbs$: Observable<Array<{ link: string | any[]; label: string }>>;
    private destroy$ = new Subject<void>();

    constructor(private breadcrumbService: BreadcrumbService) {
        this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
    }
}
