import { MockDataClientService } from './mock-data-client.service';
import { MockDataService } from './mock-data.service';

async function populate() {
    const mockDataService = new MockDataService();
    const mockDataClientService = new MockDataClientService();

    await mockDataService.connect();
    await mockDataService.clearAllTables();
    await mockDataService.populateCustomersAndAddresses();
    await mockDataService.populateAdministrators();
    await mockDataService.populateOptions();
    await mockDataClientService.populateProducts();
}

populate().then(() => process.exit(0));
