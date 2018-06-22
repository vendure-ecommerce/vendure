import { EntityIdStrategy, PrimaryKeyType } from '../config/entity-id-strategy';
import { VendureEntity } from '../entity/base/base.entity';
import { MockClass } from '../testing/testing-types';
import { ConfigService } from './config.service';

export class MockConfigService implements MockClass<ConfigService> {
    defaultLanguageCode: jest.Mock<any>;
    entityIdStrategy = new MockIdStrategy();
    connectionOptions = {};
}

export const ENCODED = 'encoded';
export const DECODED = 'decoded';

export class MockIdStrategy implements EntityIdStrategy {
    primaryKeyType = 'integer' as any;
    encodeId = jest.fn().mockReturnValue(ENCODED);
    decodeId = jest.fn().mockReturnValue(DECODED);
}
