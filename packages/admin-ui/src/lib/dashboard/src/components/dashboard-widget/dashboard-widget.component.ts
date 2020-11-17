import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { DashboardWidgetConfig } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-dashboard-widget',
    templateUrl: './dashboard-widget.component.html',
    styleUrls: ['./dashboard-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWidgetComponent implements AfterViewInit, OnDestroy {
    @Input() widgetConfig: DashboardWidgetConfig;

    @ViewChild('portal', { read: ViewContainerRef })
    private portal: ViewContainerRef;

    private componentRef: ComponentRef<any>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

    ngAfterViewInit(): void {
        this.loadWidget();
    }

    private async loadWidget() {
        const loadComponentResult = this.widgetConfig.loadComponent();
        const componentType =
            loadComponentResult instanceof Promise ? await loadComponentResult : loadComponentResult;
        this.componentRef = this.portal.createComponent(
            this.componentFactoryResolver.resolveComponentFactory(componentType),
        );
        this.componentRef.changeDetectorRef.markForCheck();
    }

    ngOnDestroy() {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }
}
