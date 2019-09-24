import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NavBuilderService, SharedModule } from '@vendure/admin-ui/src';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@NgModule({
    imports: [SharedModule],
    providers: [
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: addNavItems,
            deps: [NavBuilderService],
        },
    ],
})
export class TestSharedModule {}

export function addNavItems(navBuilder: NavBuilderService) {
    return () => {
        navBuilder.addNavMenuSection(
            {
                id: 'test-plugin',
                label: 'Test Plugin',
                items: [
                    {
                        id: 'stats',
                        label: 'Test',
                        routerLink: ['/extensions/test'],
                        icon: 'line-chart',
                    },
                ],
            },
            'settings',
        );
    };
}
