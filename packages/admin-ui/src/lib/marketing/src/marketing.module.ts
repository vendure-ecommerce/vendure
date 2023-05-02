import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BulkActionRegistryService, SharedModule } from '@vendure/admin-ui/core';

import { PromotionDetailComponent } from './components/promotion-detail/promotion-detail.component';
import { deletePromotionsBulkAction } from './components/promotion-list/promotion-list-bulk-actions';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { marketingRoutes } from './marketing.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(marketingRoutes)],
    declarations: [PromotionListComponent, PromotionDetailComponent],
})
export class MarketingModule {
    constructor(private bulkActionRegistryService: BulkActionRegistryService) {
        bulkActionRegistryService.registerBulkAction(deletePromotionsBulkAction);
    }
}
