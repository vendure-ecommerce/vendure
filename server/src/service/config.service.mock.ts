import { EntityIdStrategy, PrimaryKeyType } from '../config/entity-id-strategy';
import { VendureEntity } from '../entity/base/base.entity';
import { MockClass } from '../testing/testing-types';

import { ConfigService } from './config.service';

export class MockConfigService implements MockClass<ConfigService> {
    apiPath = 'api';
    port = 3000;
    cors = false;
    jwtSecret = 'secret';
    defaultLanguageCode: jest.Mock<any>;
    entityIdStrategy = new MockIdStrategy();
    dbConnectionOptions = {};
}

export const ENCODED = 'encoded';
export const DECODED = 'decoded';

export class MockIdStrategy implements EntityIdStrategy {
    primaryKeyType = 'integer' as any;
    encodeId = jest.fn().mockReturnValue(ENCODED);
    decodeId = jest.fn().mockReturnValue(DECODED);
}
