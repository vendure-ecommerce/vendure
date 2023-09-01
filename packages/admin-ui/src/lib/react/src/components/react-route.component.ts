import { Component, inject, InjectionToken } from '@angular/core';
import { SharedModule } from '@vendure/admin-ui/core';
import { ReactComponentHostDirective } from '../react-component-host.directive';

export const ROUTE_COMPONENT_OPTIONS = new InjectionToken<{
    component: any;
    title?: string;
    props?: Record<string, any>;
}>('ROUTE_COMPONENT_OPTIONS');

@Component({
    selector: 'vdr-react-route-component',
    template: `
        <vdr-page-header>
            <vdr-page-title *ngIf="title" [title]="title"></vdr-page-title>
        </vdr-page-header>
        <vdr-page-body><div [vdrReactComponentHost]="reactComponent" [props]="props"></div></vdr-page-body>
    `,
    standalone: true,
    imports: [ReactComponentHostDirective, SharedModule],
})
export class ReactRouteComponent {
    protected title = inject(ROUTE_COMPONENT_OPTIONS).title;
    protected props = inject(ROUTE_COMPONENT_OPTIONS).props;
    protected reactComponent = inject(ROUTE_COMPONENT_OPTIONS).component;
}
