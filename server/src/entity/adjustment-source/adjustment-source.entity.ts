import { AdjustmentOperation, AdjustmentType } from 'shared/generated-types';
import { DeepPartial, ID } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { taxAction } from '../../config/adjustment/required-adjustment-actions';
import { taxCondition } from '../../config/adjustment/required-adjustment-conditions';
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

    /**
     * Returns a new AdjustmentSource configured as a tax category.
     */
    static createTaxCategory(taxRate: number, name: string, id?: ID): AdjustmentSource {
        return new AdjustmentSource({
            id,
            name,
            type: AdjustmentType.TAX,
            conditions: [
                {
                    code: taxCondition.code,
                    args: [],
                },
            ],
            actions: [
                {
                    code: taxAction.code,
                    args: [
                        {
                            type: 'percentage',
                            name: 'taxRate',
                            value: taxRate.toString(),
                        },
                    ],
                },
            ],
        });
    }
}
