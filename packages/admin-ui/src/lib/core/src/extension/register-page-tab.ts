import { APP_INITIALIZER, Provider } from '@angular/core';
import { PageService, PageTabConfig } from '../providers/page/page.service';

/**
 * @description
 * Add a tab to an existing list or detail page.
 *
 * @example
 * ```ts title="providers.ts"
 * import { registerPageTab } from '@vendure/admin-ui/core';
 * import { DeletedProductListComponent } from './components/deleted-product-list/deleted-product-list.component';
 *
 * export default [
 *     registerPageTab({
 *         location: 'product-list',
 *         tab: 'Deleted Products',
 *         route: 'deleted',
 *         component: DeletedProductListComponent,
 *     }),
 * ];
 * ```
 * @docsCategory tabs
 */
export function registerPageTab(config: PageTabConfig): Provider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (pageService: PageService) => () => {
            pageService.registerPageTab({
                ...config,
                priority: config.priority || 1,
            });
        },
        deps: [PageService],
    };
}
