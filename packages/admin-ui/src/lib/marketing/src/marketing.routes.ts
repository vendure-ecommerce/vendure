import { Route } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { CanDeactivateDetailGuard, createResolveData, detailBreadcrumb, Promotion } from '@vendure/admin-ui/core';

import { PromotionDetailComponent } from './components/promotion-detail/promotion-detail.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { PromotionResolver } from './providers/routing/promotion-resolver';

export const marketingRoutes: Route[] = [
    {
        path: 'promotions',
        component: PromotionListComponent,
        data: {
            breadcrumb: _('breadcrumb.promotions'),
        },
    },
    {
        path: 'promotions/:id',
        component: PromotionDetailComponent,
        resolve: createResolveData(PromotionResolver),
        canDeactivate: [CanDeactivateDetailGuard],
        data: {
            breadcrumb: promotionBreadcrumb,
        },
    },
];

export function promotionBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<Promotion.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.promotions',
        getName: promotion => promotion.name,
        route: 'promotions',
    });
}
