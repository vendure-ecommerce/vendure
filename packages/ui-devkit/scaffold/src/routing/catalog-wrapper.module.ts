import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogModule } from '@vendure/admin-ui';

@NgModule({
    imports: [CatalogModule],
})
export class CatalogWrapperModule {}
