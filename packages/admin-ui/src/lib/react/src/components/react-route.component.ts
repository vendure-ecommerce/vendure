import { Component, inject, InjectionToken } from '@angular/core';
import { SharedModule } from '@vendure/admin-ui/core';
import { ReactComponentHostDirective } from '../react-component-host.directive';
import { ReactRouteComponentOptions } from '../types';

export const ROUTE_COMPONENT_OPTIONS = new InjectionToken<ReactRouteComponentOptions>(
    'ROUTE_COMPONENT_OPTIONS',
);

@Component({
    selector: 'vdr-react-route-component',
    template: `
        <vdr-page-header>
            <vdr-page-title *ngIf="title$ | async as title" [title]="title"></vdr-page-title>
        </vdr-page-header>
        <vdr-page-body
            ><div [vdrReactComponentHost]="reactComponent" [props]="props" [context]="context"></div
        ></vdr-page-body>
    `,
    standalone: true,
    imports: [ReactComponentHostDirective, SharedModule],
})
export class ReactRouteComponent {
    protected title$ = inject(ROUTE_COMPONENT_OPTIONS).title$;
    protected props = inject(ROUTE_COMPONENT_OPTIONS).props;
    protected context = inject(ROUTE_COMPONENT_OPTIONS);
    protected reactComponent = inject(ROUTE_COMPONENT_OPTIONS).component;
}
