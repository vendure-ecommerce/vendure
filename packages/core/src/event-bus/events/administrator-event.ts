import {
    CreateAdministratorInput,
    CreateChannelAdministratorInput,
    UpdateAdministratorInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { Administrator } from '../../entity';
import { VendureEntityEvent } from '../vendure-entity-event';

// TODO remove the non-channeladmin inputs?
type AdministratorInputTypes =
    | CreateAdministratorInput
    | CreateChannelAdministratorInput
    | UpdateAdministratorInput
    | ID;

/**
 * @description
 * This event is fired whenever a {@link Administrator} is added, updated or deleted.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class AdministratorEvent extends VendureEntityEvent<Administrator, AdministratorInputTypes> {
    constructor(
        ctx: RequestContext,
        entity: Administrator,
        type: 'created' | 'updated' | 'deleted',
        input?: AdministratorInputTypes,
    ) {
        super(entity, type, ctx, input);
    }
}
