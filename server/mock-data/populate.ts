import { devConfig } from '../dev-config';
import { bootstrap } from '../src';
import { setConfig, VendureConfig } from '../src/config/vendure-config';

import { clearAllTables } from './clear-all-tables';
import { MockDataClientService } from './mock-data-client.service';

// tslint:disable:no-floating-promises
async function populate() {
    const populateConfig: VendureConfig = {
        ...devConfig,
        customFields: {},
    };
    (populateConfig.dbConnectionOptions as any).logging = false;
    setConfig(populateConfig);
    await clearAllTables(populateConfig.dbConnectionOptions);

    await bootstrap(populateConfig).catch(err => {
        // tslint:disable-next-line
        console.log(err);
    });

    const mockDataClientService = new MockDataClientService(devConfig);
    await mockDataClientService.populateOptions();
    await mockDataClientService.populateProducts(5);
    await mockDataClientService.populateCustomers(5);
    await mockDataClientService.populateAdmins();
}

populate().then(() => process.exit(0));
