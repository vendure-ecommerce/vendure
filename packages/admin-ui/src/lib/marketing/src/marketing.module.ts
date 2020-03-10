import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { PromotionDetailComponent } from './components/promotion-detail/promotion-detail.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { marketingRoutes } from './marketing.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(marketingRoutes)],
    declarations: [PromotionListComponent, PromotionDetailComponent],
})
export class MarketingModule {}
