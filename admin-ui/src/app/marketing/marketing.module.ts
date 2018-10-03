import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { AdjustmentOperationInputComponent } from './components/adjustment-operation-input/adjustment-operation-input.component';
import { PromotionDetailComponent } from './components/promotion-detail/promotion-detail.component';
import { PromotionListComponent } from './components/promotion-list/promotion-list.component';
import { marketingRoutes } from './marketing.routes';
import { PromotionResolver } from './providers/routing/promotion-resolver';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(marketingRoutes)],
    declarations: [PromotionListComponent, PromotionDetailComponent, AdjustmentOperationInputComponent],
    providers: [PromotionResolver],
})
export class MarketingModule {}
