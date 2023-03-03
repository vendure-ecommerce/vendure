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
