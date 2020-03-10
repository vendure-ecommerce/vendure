import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { AddressCardComponent } from './components/address-card/address-card.component';
import { CustomerDetailComponent } from './components/customer-detail/customer-detail.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { CustomerStatusLabelComponent } from './components/customer-status-label/customer-status-label.component';
import { customerRoutes } from './customer.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(customerRoutes)],
    declarations: [
        CustomerListComponent,
        CustomerDetailComponent,
        CustomerStatusLabelComponent,
        AddressCardComponent,
    ],
    exports: [AddressCardComponent],
})
export class CustomerModule {}
