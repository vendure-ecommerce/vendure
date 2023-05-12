import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageLocationId } from '../../../common/component-registry-types';
import { HeaderTab } from '../page-header-tabs/page-header-tabs.component';
import { PageService } from '../../../providers/page/page.service';

@Component({
    selector: 'vdr-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
    headerTabs: HeaderTab[] = [];
    @Input() protected locationId: PageLocationId;
    @Input() protected description: string;
    constructor(private route: ActivatedRoute, private pageService: PageService) {
        this.locationId = this.route.snapshot.data.locationId;
        this.description = this.route.snapshot.data.description ?? '';
        this.headerTabs = this.pageService.getPageTabs(this.locationId).map(tab => ({
            id: tab.tab,
            label: tab.tab,
            icon: tab.tabIcon,
            route: tab.route ? [tab.route] : ['./'],
        }));
    }
}
