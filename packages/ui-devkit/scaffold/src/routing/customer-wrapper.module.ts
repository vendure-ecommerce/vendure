import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomerModule } from '@vendure/admin-ui';

@NgModule({
    imports: [CustomerModule],
})
export class CustomerWrapperModule {}
