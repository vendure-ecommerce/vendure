import { CurrencyCode, LanguageCode } from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { CustomChannelFields } from '../custom-entity-fields';
import { EntityId } from '../entity-id.decorator';
import { Seller } from '../seller/seller.entity';
import { Zone } from '../zone/zone.entity';

/**
 * @description
 * A Channel represents a distinct sales channel and configures defaults for that
 * channel.
 *
 * @docsCategory entities
 */
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

    @Column({ default: '', nullable: true })
    description: string;

    @ManyToOne(type => Seller)
    seller: Seller;

    @EntityId({ nullable: false })
    sellerId: ID;

    @Column('varchar') defaultLanguageCode: LanguageCode;

    @Index()
    @ManyToOne(type => Zone)
    defaultTaxZone: Zone;

    @Index()
    @ManyToOne(type => Zone)
    defaultShippingZone: Zone;

    @Column('varchar')
    currencyCode: CurrencyCode;

    @Column(type => CustomChannelFields)
    customFields: CustomChannelFields;

    @Column() pricesIncludeTax: boolean;

    private generateToken(): string {
        const randomString = () => Math.random().toString(36).substr(3, 10);
        return `${randomString()}${randomString()}`;
    }
}
