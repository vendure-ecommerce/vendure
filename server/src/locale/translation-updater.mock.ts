import { MockClass } from '../testing/testing-types';

import { TranslationUpdater } from './translation-updater';
import { TranslationUpdaterService } from './translation-updater.service';

export class MockTranslationUpdater implements MockClass<TranslationUpdater<any>> {
    diff = jest.fn();
    applyDiff = jest.fn();
}

export class MockTranslationUpdaterService implements MockClass<TranslationUpdaterService> {
    mockUpdater = new MockTranslationUpdater();
    create = jest.fn().mockReturnValue(this.mockUpdater);
}
