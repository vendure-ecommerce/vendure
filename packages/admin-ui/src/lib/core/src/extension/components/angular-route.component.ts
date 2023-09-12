import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ROUTE_COMPONENT_OPTIONS, RouteComponent } from './route.component';

@Component({
    selector: 'vdr-angular-route-component',
    template: ` <vdr-route-component><ng-container *ngComponentOutlet="component" /></vdr-route-component> `,
    standalone: true,
    imports: [SharedModule, RouteComponent],
})
export class AngularRouteComponent {
    protected component = inject(ROUTE_COMPONENT_OPTIONS).component;
}
