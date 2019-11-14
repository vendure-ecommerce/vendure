import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { GetGlobalSettings } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the global settings.
 */
@Injectable()
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
