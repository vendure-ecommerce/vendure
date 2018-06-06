import { MockDataService } from './mock-data.service';

new MockDataService().populate().then(() => process.exit(0));
