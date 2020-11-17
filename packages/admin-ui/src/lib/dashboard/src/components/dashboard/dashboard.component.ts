import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DashboardWidgetConfig, DashboardWidgetService } from '@vendure/admin-ui/core';
import { assertNever } from '@vendure/common/lib/shared-utils';

type WidgetLayout = DashboardWidgetConfig[][];

@Component({
    selector: 'vdr-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
    widgetLayout: WidgetLayout;

    constructor(private dashboardWidgetService: DashboardWidgetService) {}

    ngOnInit() {
        this.widgetLayout = this.buildLayout(this.dashboardWidgetService.getWidgets());
    }

    getClassForWidth(width: DashboardWidgetConfig['width']): string {
        switch (width) {
            case 3:
                return `clr-col-12 clr-col-sm-6 clr-col-lg-3`;
            case 4:
                return `clr-col-12 clr-col-sm-6 clr-col-lg-4`;
            case 6:
                return `clr-col-12 clr-col-lg-6`;
            case 12:
                return `clr-col-12`;
            default:
                assertNever(width);
        }
    }

    private buildLayout(widgetConfigs: DashboardWidgetConfig[]): WidgetLayout {
        const layout: WidgetLayout = [];
        let row: DashboardWidgetConfig[] = [];
        for (const config of widgetConfigs) {
            const rowSize = row.reduce((size, c) => size + c.width, 0);
            if (12 < rowSize + config.width) {
                layout.push(row);
                row = [];
            }
            row.push(config);
        }
        layout.push(row);
        return layout;
    }
}
