import { AsyncPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, ROUTES } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BulkActionRegistryService,
    detailComponentWithResolver,
    GetPromotionDetailDocument,
    PageService,
    SharedModule,
} from '@vendure/admin-ui/core';

import { PromotionDetailComponent } from './components/promotion-detail/promotion-detail.component';
import { deletePromotionsBulkAction } from './components/promotion-list/promotion-list-bulk-actions';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { createRoutes } from './marketing.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild([]), SharedModule, AsyncPipe, SharedModule],
    providers: [
        {
            provide: ROUTES,
            useFactory: (pageService: PageService) => createRoutes(pageService),
            multi: true,
            deps: [PageService],
        },
    ],
    declarations: [PromotionListComponent, PromotionDetailComponent],
})
export class MarketingModule {
    constructor(private bulkActionRegistryService: BulkActionRegistryService, pageService: PageService) {
        bulkActionRegistryService.registerBulkAction(deletePromotionsBulkAction);

        pageService.registerPageTab({
            location: 'promotion-list',
            tab: _('breadcrumb.promotions'),
            route: '',
            component: PromotionListComponent,
        });
        pageService.registerPageTab({
            location: 'promotion-detail',
            tab: _('marketing.promotion'),
            route: '',
            component: detailComponentWithResolver({
                component: PromotionDetailComponent,
                query: GetPromotionDetailDocument,
                entityKey: 'promotion',
                getBreadcrumbs: entity => [
                    {
                        label: entity ? entity.name : _('marketing.create-new-promotion'),
                        link: [entity?.id],
                    },
                ],
            }),
        });
    }
}
