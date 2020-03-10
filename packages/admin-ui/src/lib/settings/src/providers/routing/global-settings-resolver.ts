import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { GetGlobalSettings } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

/**
 * Resolves the global settings.
 */
@Injectable({
    providedIn: 'root',
})
export class GlobalSettingsResolver extends BaseEntityResolver<GetGlobalSettings.GlobalSettings> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            // we will never be creating a new GlobalSettings entity, so this part is not used.
            {} as any,
            () => dataService.settings.getGlobalSettings().mapStream(data => data.globalSettings),
        );
    }
}
