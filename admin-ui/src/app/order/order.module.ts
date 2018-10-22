import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { orderRoutes } from './order.routes';
import { OrderResolver } from './providers/routing/order-resolver';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(orderRoutes)],
    declarations: [OrderListComponent, OrderDetailComponent],
    providers: [OrderResolver],
})
export class OrderModule {}
