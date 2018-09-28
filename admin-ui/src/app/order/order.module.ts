import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { OrderListComponent } from './components/order-list/order-list.component';
import { orderRoutes } from './order.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(orderRoutes)],
    declarations: [OrderListComponent],
    providers: [],
})
export class OrderModule {}
