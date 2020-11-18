import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DashboardWidgetConfig, DashboardWidgetService, DashboardWidgetWidth } from '@vendure/admin-ui/core';
import { assertNever } from '@vendure/common/lib/shared-utils';

type WidgetLayout = Array<Array<{ width: DashboardWidgetWidth; config: DashboardWidgetConfig }>>;

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
        this.widgetLayout = this.dashboardWidgetService.getWidgetLayout();
    }

    getClassForWidth(width: DashboardWidgetWidth): string {
        switch (width) {
            case 3:
                return `clr-col-12 clr-col-sm-6 clr-col-lg-3`;
            case 4:
                return `clr-col-12 clr-col-sm-6 clr-col-lg-4`;
            case 6:
                return `clr-col-12 clr-col-lg-6`;
            case 8:
                return `clr-col-12 clr-col-lg-8`;
            case 12:
                return `clr-col-12`;
            default:
                assertNever(width);
        }
    }
}
