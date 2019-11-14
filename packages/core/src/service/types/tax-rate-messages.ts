import { ID } from '@vendure/common/lib/shared-types';

import { WorkerMessage } from '../../worker/types';

/**
 * A message sent to the Worker whenever a TaxRate is updated.
 */
export class TaxRateUpdatedMessage extends WorkerMessage<ID, boolean> {
    static readonly pattern = 'TaxRateUpdated';
}
