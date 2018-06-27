import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { catalogRoutes } from './catalog.routes';
import { ProductListComponent } from './components/product-list/product-list.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(catalogRoutes),
    ],
    exports: [],
    declarations: [ProductListComponent],
    providers: [],
})
export class CatalogModule {
}
