import { Route } from '@angular/router';
import { AdjustmentSource } from 'shared/generated-types';

import { createResolveData } from '../common/base-entity-resolver';
import { detailBreadcrumb } from '../common/detail-breadcrumb';
import { _ } from '../core/providers/i18n/mark-for-extraction';

import { TaxCategoryDetailComponent } from './components/tax-category-detail/tax-category-detail.component';
import { TaxCategoryListComponent } from './components/tax-category-list/tax-category-list.component';
import { TaxCategoryResolver } from './providers/routing/tax-category-resolver';

export const settingsRoutes: Route[] = [
    {
        path: 'tax-categories',
        component: TaxCategoryListComponent,
        data: {
            breadcrumb: _('breadcrumb.tax-categories'),
        },
    },
    {
        path: 'tax-categories/:id',
        component: TaxCategoryDetailComponent,
        resolve: createResolveData(TaxCategoryResolver),
        data: {
            breadcrumb: taxCategoryBreadcrumb,
        },
    },
];

export function taxCategoryBreadcrumb(data: any, params: any) {
    return detailBreadcrumb<AdjustmentSource.Fragment>({
        entity: data.entity,
        id: params.id,
        breadcrumbKey: 'breadcrumb.tax-categories',
        getName: promotion => promotion.name,
        route: 'tax-categories',
    });
}
