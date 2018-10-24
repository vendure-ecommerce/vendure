import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { customerRoutes } from './customer.routes';
import { CustomerResolver } from './providers/routing/customer-resolver';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(customerRoutes)],
    declarations: [CustomerListComponent, CustomerDetailComponent],
    providers: [CustomerResolver],
})
export class CustomerModule {}
