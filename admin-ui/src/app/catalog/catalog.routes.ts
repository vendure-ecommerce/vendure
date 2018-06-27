import { Route } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';

export const catalogRoutes: Route[] = [
    {
        path: 'products',
        component: ProductListComponent,
    },
];
