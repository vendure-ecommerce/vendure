import { Column, Entity, ManyToOne } from 'typeorm';

import { CurrencyCode, LanguageCode } from '../../../../shared/generated-types';
import { DeepPartial } from '../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { Zone } from '../zone/zone.entity';

@Entity()
export class Channel extends VendureEntity {
    constructor(input?: DeepPartial<Channel>) {
        super(input);
        if (!input || !input.token) {
            this.token = this.generateToken();
        }
    }

    @Column({ unique: true })
    code: string;

    @Column({ unique: true })
    token: string;

    @Column('varchar') defaultLanguageCode: LanguageCode;

    @ManyToOne(type => Zone)
    defaultTaxZone: Zone;

    @ManyToOne(type => Zone)
    defaultShippingZone: Zone;

    @Column('varchar')
    currencyCode: CurrencyCode;

    @Column() pricesIncludeTax: boolean;

    private generateToken(): string {
        const randomString = () =>
            Math.random()
                .toString(36)
                .substr(3, 10);
        return `${randomString()}${randomString()}`;
    }
}
