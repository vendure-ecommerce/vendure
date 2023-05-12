import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface HeaderTab {
    id: string;
    label: string;
    icon?: string;
    route?: string[];
}

@Component({
    selector: 'vdr-page-header-tabs',
    templateUrl: './page-header-tabs.component.html',
    styleUrls: ['./page-header-tabs.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderTabsComponent {
    @Input() tabs: HeaderTab[] = [];
}
