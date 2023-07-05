import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware } from '../../common/index';
import { HasCustomFields } from '../../config/index';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomStockLocationFields } from '../custom-entity-fields';

/**
 * @description
 * A StockLocation represents a physical location where stock is held. For example, a warehouse or a shop.
 *
 * When the stock of a {@link ProductVariant} is adjusted, the adjustment is applied to a specific StockLocation,
 * and the stockOnHand of that ProductVariant is updated accordingly. When there are multiple StockLocations
 * configured, the {@link StockLocationStrategy} is used to determine which StockLocation should be used for
 * a given operation.
 *
 * @docsCategory entities
 */
@Entity()
export class StockLocation extends VendureEntity implements HasCustomFields, ChannelAware {
    constructor(input: DeepPartial<StockLocation>) {
        super(input);
    }
    @Column()
    name: string;

    @Column()
    description: string;

    @Column(type => CustomStockLocationFields)
    customFields: CustomStockLocationFields;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
