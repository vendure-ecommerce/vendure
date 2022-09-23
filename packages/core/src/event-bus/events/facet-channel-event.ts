import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Facet } from '../../entity';
import { VendureEvent } from '../vendure-event';

/**
 * @description
 * This event is fired whenever an {@link Facet} is assigned or removed
 * From a channel.
 *
 * @docsCategory events
 * @docsPage Event Types
 */
export class FacetChannelEvent extends VendureEvent {
    constructor(
        public ctx: RequestContext,
        public facet: Facet,
        public channelId: ID,
        public type: 'assigned' | 'removed',
    ) {
        super();
    }
}
