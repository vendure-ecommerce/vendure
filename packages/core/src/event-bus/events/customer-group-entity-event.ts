import { CreateCustomerGroupInput, UpdateCustomerGroupInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { CustomerGroup } from '../../entity';
import { VendureEntityEvent } from '../vendure-entity-event';

type CustomerGroupInputTypes = CreateCustomerGroupInput | UpdateCustomerGroupInput | ID;

/**
 * @description
 * This event is fired whenever a {@link CustomerGroup} is added, updated or deleted.
 * Use this event instead of {@link CustomerGroupEvent} until the next major version!
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class CustomerGroupEntityEvent extends VendureEntityEvent<CustomerGroup, CustomerGroupInputTypes> {
    // TODO: Rename to CustomerGroupEvent in v2
    constructor(
        ctx: RequestContext,
        entity: CustomerGroup,
        type: 'created' | 'updated' | 'deleted',
        input?: CustomerGroupInputTypes,
    ) {
        super(entity, type, ctx, input);
    }
}
