import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Collection } from '../../entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever an {@link Collection} is assigned or removed
 * From a channel.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class CollectionChannelEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public collection: Collection,
        public channelId: ID,
        public type: 'assigned' | 'removed',
    ) {
        super();
    }
}
