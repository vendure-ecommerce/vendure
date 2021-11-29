import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { addActionBarItem, AppComponent, AppComponentModule } from '@vendure/admin-ui/core';

import { routes } from './app.routes';

@NgModule({
    declarations: [],
    imports: [
        AppComponentModule,
        RouterModule.forRoot(routes, { useHash: false, relativeLinkResolution: 'legacy' }),
    ],
    providers: [
        addActionBarItem({
            id: 'test',
            locationId: 'product-detail',
            buttonStyle: 'link',
            label: 'Test Button',
        }),
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
