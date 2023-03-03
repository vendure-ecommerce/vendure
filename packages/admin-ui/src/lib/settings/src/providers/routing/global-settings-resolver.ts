import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver, DataService, GetGlobalSettingsQuery } from '@vendure/admin-ui/core';

/**
 * Resolves the global settings.
 */
@Injectable({
    providedIn: 'root',
})
export class GlobalSettingsResolver extends BaseEntityResolver<GetGlobalSettingsQuery['globalSettings']> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            // we will never be creating a new GlobalSettings entity, so this part is not used.
            {} as any,
            () => dataService.settings.getGlobalSettings().mapStream(data => data.globalSettings),
        );
    }
}
