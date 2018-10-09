import { AdjustmentOperation, AdjustmentType } from 'shared/generated-types';
import { DeepPartial, ID } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { I18nError } from '../../i18n/i18n-error';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

@Entity()
export class AdjustmentSource extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<AdjustmentSource>) {
        super(input);
    }

    @Column() name: string;

    @Column() enabled: boolean;

    @Column('varchar') type: AdjustmentType;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @Column('simple-json') conditions: AdjustmentOperation[];

    @Column('simple-json') actions: AdjustmentOperation[];

    /**
     * A shorthand method for getting the tax rate on a TAX type adjustment source.
     */
    getTaxCategoryRate(): number {
        if (this.type !== AdjustmentType.TAX) {
            throw new I18nError(`error.getTaxCategoryRate-only-valid-for-tax-adjustment-sources`);
        }
        return Number(this.actions[0].args[0].value);
    }
}

/**
 * When an AdjustmentSource is applied to an OrderItem or Order, an Adjustment is
 * generated based on the actions assigned to the AdjustmentSource.
 */
export interface Adjustment {
    adjustmentSourceId: ID;
    description: string;
    amount: number;
}
