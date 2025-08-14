import { Injector } from '@vendure/core';

import { BaseDataProcessor } from './base-data-processor';

export class EntitiesDataProcessor extends BaseDataProcessor {
    init(injector: Injector) {
        super.init(injector);
        // add necessary DI
    }
}
