import { CreateAssetInput, DeleteAssetInput, UpdateAssetInput } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../api';
import { Asset } from '../../entity';
import { VendureEntityEvent } from '../vendure-entity-event';

type AssetInputTypes = CreateAssetInput | UpdateAssetInput | DeleteAssetInput;

/**
 * @description
 * This event is fired whenever aa {@link Asset} is added, updated
 * or deleted. The `input` property is only defined for `'created'` & `'updated'` event types.
 *
 * @docsCategory events
 * @docsPage Event Types
 * @since 1.4
 */
export class AssetEvent extends VendureEntityEvent<Asset, AssetInputTypes> {
    constructor(
        public ctx: RequestContext,
        public entity: Asset,
        public type: 'created' | 'updated' | 'deleted',
        public input?: AssetInputTypes,
    ) {
        super(entity, type, ctx, input);
    }

    /**
     * Return an asset field to become compatible with the
     * deprecated old version of AssetEvent
     * @deprecated Use `entity` instead
     * @since 1.4
     */
    get asset(): Asset {
        return this.entity;
    }
}
