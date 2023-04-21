import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

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
export class PageHeaderTabsComponent implements OnChanges {
    @Input() tabs: HeaderTab[] = [];
    @Input() selectedTabId: string | undefined;

    ngOnChanges(changes: SimpleChanges) {
        if (this.tabs.length && !this.selectedTabId) {
            this.selectedTabId = this.tabs[0]?.id;
        }
    }
}
