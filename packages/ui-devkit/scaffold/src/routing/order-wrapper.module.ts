import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderModule } from '@vendure/admin-ui';

@NgModule({
    imports: [OrderModule],
})
export class OrderWrapperModule {}
